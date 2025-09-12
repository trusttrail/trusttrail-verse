// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TrustTrailReviews is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    
    // State variables for staking
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public lastRewardClaimTime;
    uint256 public totalStaked;
    
    struct Review {
        uint256 id;
        address reviewer;
        string companyName;
        string category;
        string ipfsHash;
        string documentHash;
        uint8 rating;
        uint256 timestamp;
        ReviewStatus status;
        uint256 upvotes;
        uint256 downvotes;
        bool exists;
    }
    
    struct Comment {
        uint256 id;
        uint256 reviewId;
        address commenter;
        string content;
        uint256 timestamp;
        bool exists;
    }
    
    enum ReviewStatus { Pending, Approved, Rejected, Flagged }
    
    mapping(uint256 => Review) public reviews;
    mapping(uint256 => Comment[]) public reviewComments;
    mapping(address => uint256[]) public userReviews;
    mapping(address => uint256) public userReputations;
    mapping(uint256 => mapping(address => bool)) public hasUpvoted;
    mapping(uint256 => mapping(address => bool)) public hasDownvoted;
    
    uint256 public nextReviewId = 1;
    uint256 public nextCommentId = 1;
    uint256 public reviewReward = 10 * 10**18; // 10 tokens
    uint256 public upvoteReward = 1 * 10**18;  // 1 token
    
    IERC20 public rewardToken;
    
    // Staking parameters
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
    uint256 public annualRewardRate = 10; // 10% annual reward rate
    
    event ReviewSubmitted(uint256 indexed reviewId, address indexed reviewer, string companyName);
    event ReviewApproved(uint256 indexed reviewId);
    event ReviewRejected(uint256 indexed reviewId);
    event ReviewFlagged(uint256 indexed reviewId);
    event ReviewUpvoted(uint256 indexed reviewId, address indexed voter);
    event ReviewDownvoted(uint256 indexed reviewId, address indexed voter);
    event CommentAdded(uint256 indexed commentId, uint256 indexed reviewId, address indexed commenter);
    event RewardDistributed(address indexed recipient, uint256 amount, string reason);
    event TokensStaked(address indexed staker, uint256 amount);
    event TokensUnstaked(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 amount);
    
    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MODERATOR_ROLE, msg.sender);
    }
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }
    
    modifier onlyModerator() {
        require(hasRole(MODERATOR_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), "Caller is not a moderator");
        _;
    }
    
    function submitReview(
        string memory _companyName,
        string memory _category,
        string memory _ipfsHash,
        string memory _documentHash,
        uint8 _rating
    ) external whenNotPaused nonReentrant {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(bytes(_companyName).length > 0, "Company name cannot be empty");
        require(bytes(_category).length > 0, "Category cannot be empty");
        
        uint256 reviewId = nextReviewId++;
        
        reviews[reviewId] = Review({
            id: reviewId,
            reviewer: msg.sender,
            companyName: _companyName,
            category: _category,
            ipfsHash: _ipfsHash,
            documentHash: _documentHash,
            rating: _rating,
            timestamp: block.timestamp,
            status: ReviewStatus.Pending,
            upvotes: 0,
            downvotes: 0,
            exists: true
        });
        
        userReviews[msg.sender].push(reviewId);
        
        emit ReviewSubmitted(reviewId, msg.sender, _companyName);
    }
    
    function approveReview(uint256 _reviewId) external onlyModerator {
        require(reviews[_reviewId].exists, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Pending, "Review is not pending");
        
        reviews[_reviewId].status = ReviewStatus.Approved;
        userReputations[reviews[_reviewId].reviewer] += 10;
        
        // Distribute reward to reviewer
        if (rewardToken.balanceOf(address(this)) >= reviewReward) {
            rewardToken.transfer(reviews[_reviewId].reviewer, reviewReward);
            emit RewardDistributed(reviews[_reviewId].reviewer, reviewReward, "Review approved");
        }
        
        emit ReviewApproved(_reviewId);
    }
    
    function rejectReview(uint256 _reviewId) external onlyModerator {
        require(reviews[_reviewId].exists, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Pending, "Review is not pending");
        
        reviews[_reviewId].status = ReviewStatus.Rejected;
        emit ReviewRejected(_reviewId);
    }
    
    function flagReview(uint256 _reviewId) external onlyModerator {
        require(reviews[_reviewId].exists, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Approved, "Review is not approved");
        
        reviews[_reviewId].status = ReviewStatus.Flagged;
        userReputations[reviews[_reviewId].reviewer] = userReputations[reviews[_reviewId].reviewer] > 5 
            ? userReputations[reviews[_reviewId].reviewer] - 5 : 0;
        
        emit ReviewFlagged(_reviewId);
    }
    
    function upvoteReview(uint256 _reviewId) external whenNotPaused nonReentrant {
        require(reviews[_reviewId].exists, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Approved, "Review is not approved");
        require(!hasUpvoted[_reviewId][msg.sender], "Already upvoted");
        require(reviews[_reviewId].reviewer != msg.sender, "Cannot vote on own review");
        
        if (hasDownvoted[_reviewId][msg.sender]) {
            reviews[_reviewId].downvotes--;
            hasDownvoted[_reviewId][msg.sender] = false;
        }
        
        reviews[_reviewId].upvotes++;
        hasUpvoted[_reviewId][msg.sender] = true;
        userReputations[reviews[_reviewId].reviewer] += 1;
        
        // Distribute reward to reviewer for getting upvoted
        if (rewardToken.balanceOf(address(this)) >= upvoteReward) {
            rewardToken.transfer(reviews[_reviewId].reviewer, upvoteReward);
            emit RewardDistributed(reviews[_reviewId].reviewer, upvoteReward, "Review upvoted");
        }
        
        emit ReviewUpvoted(_reviewId, msg.sender);
    }
    
    function downvoteReview(uint256 _reviewId) external whenNotPaused nonReentrant {
        require(reviews[_reviewId].exists, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Approved, "Review is not approved");
        require(!hasDownvoted[_reviewId][msg.sender], "Already downvoted");
        require(reviews[_reviewId].reviewer != msg.sender, "Cannot vote on own review");
        
        if (hasUpvoted[_reviewId][msg.sender]) {
            reviews[_reviewId].upvotes--;
            hasUpvoted[_reviewId][msg.sender] = false;
            userReputations[reviews[_reviewId].reviewer] = userReputations[reviews[_reviewId].reviewer] > 0 
                ? userReputations[reviews[_reviewId].reviewer] - 1 : 0;
        }
        
        reviews[_reviewId].downvotes++;
        hasDownvoted[_reviewId][msg.sender] = true;
        
        emit ReviewDownvoted(_reviewId, msg.sender);
    }
    
    function addComment(uint256 _reviewId, string memory _content) external whenNotPaused {
        require(reviews[_reviewId].exists, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Approved, "Review is not approved");
        require(bytes(_content).length > 0, "Comment cannot be empty");
        
        uint256 commentId = nextCommentId++;
        
        Comment memory newComment = Comment({
            id: commentId,
            reviewId: _reviewId,
            commenter: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            exists: true
        });
        
        reviewComments[_reviewId].push(newComment);
        
        emit CommentAdded(commentId, _reviewId, msg.sender);
    }
    
    // Staking functions
    function stakeTokens(uint256 _amount) external whenNotPaused nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(rewardToken.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(rewardToken.allowance(msg.sender, address(this)) >= _amount, "Insufficient allowance");
        
        // Claim any pending rewards before staking more
        if (stakedBalances[msg.sender] > 0) {
            claimRewards();
        }
        
        rewardToken.transferFrom(msg.sender, address(this), _amount);
        stakedBalances[msg.sender] += _amount;
        totalStaked += _amount;
        lastRewardClaimTime[msg.sender] = block.timestamp;
        
        emit TokensStaked(msg.sender, _amount);
    }
    
    function unstakeTokens(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(stakedBalances[msg.sender] >= _amount, "Insufficient staked balance");
        
        // Claim rewards before unstaking
        claimRewards();
        
        stakedBalances[msg.sender] -= _amount;
        totalStaked -= _amount;
        rewardToken.transfer(msg.sender, _amount);
        
        emit TokensUnstaked(msg.sender, _amount);
    }
    
    function claimRewards() public nonReentrant {
        uint256 rewards = calculateRewards(msg.sender);
        if (rewards > 0) {
            lastRewardClaimTime[msg.sender] = block.timestamp;
            if (rewardToken.balanceOf(address(this)) >= rewards) {
                rewardToken.transfer(msg.sender, rewards);
                emit RewardsClaimed(msg.sender, rewards);
            }
        }
    }
    
    function calculateRewards(address _staker) public view returns (uint256) {
        if (stakedBalances[_staker] == 0) {
            return 0;
        }
        
        uint256 timeDiff = block.timestamp - lastRewardClaimTime[_staker];
        uint256 annualReward = (stakedBalances[_staker] * annualRewardRate) / 100;
        uint256 reward = (annualReward * timeDiff) / SECONDS_PER_YEAR;
        
        return reward;
    }
    
    // View functions
    function getReview(uint256 _reviewId) external view returns (Review memory) {
        require(reviews[_reviewId].exists, "Review does not exist");
        return reviews[_reviewId];
    }
    
    function getCompanyReviews(string memory _companyName) external view returns (uint256[] memory) {
        uint256[] memory companyReviewIds = new uint256[](nextReviewId - 1);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextReviewId; i++) {
            if (reviews[i].exists && 
                keccak256(abi.encodePacked(reviews[i].companyName)) == keccak256(abi.encodePacked(_companyName)) &&
                reviews[i].status == ReviewStatus.Approved) {
                companyReviewIds[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = companyReviewIds[i];
        }
        
        return result;
    }
    
    function getUserReviews(address _user) external view returns (uint256[] memory) {
        return userReviews[_user];
    }
    
    function getReviewComments(uint256 _reviewId) external view returns (Comment[] memory) {
        require(reviews[_reviewId].exists, "Review does not exist");
        return reviewComments[_reviewId];
    }
    
    function getComment(uint256 _reviewId, uint256 _commentIndex) external view returns (Comment memory) {
        require(reviews[_reviewId].exists, "Review does not exist");
        require(_commentIndex < reviewComments[_reviewId].length, "Comment does not exist");
        return reviewComments[_reviewId][_commentIndex];
    }
    
    function getStakedBalance(address _staker) external view returns (uint256) {
        return stakedBalances[_staker];
    }
    
    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }
    
    // Admin functions
    function setRewardAmounts(uint256 _reviewReward, uint256 _upvoteReward) external onlyAdmin {
        reviewReward = _reviewReward;
        upvoteReward = _upvoteReward;
    }
    
    function addModerator(address _moderator) external onlyAdmin {
        grantRole(MODERATOR_ROLE, _moderator);
    }
    
    function removeModerator(address _moderator) external onlyAdmin {
        revokeRole(MODERATOR_ROLE, _moderator);
    }
    
    function pause() external onlyAdmin {
        _pause();
    }
    
    function unpause() external onlyAdmin {
        _unpause();
    }
    
    function withdrawTokens(uint256 _amount) external onlyAdmin {
        require(rewardToken.balanceOf(address(this)) >= _amount, "Insufficient contract balance");
        rewardToken.transfer(msg.sender, _amount);
    }
    
    function emergencyWithdraw() external onlyAdmin {
        uint256 balance = rewardToken.balanceOf(address(this));
        rewardToken.transfer(msg.sender, balance);
    }
}
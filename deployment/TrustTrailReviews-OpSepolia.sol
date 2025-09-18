// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title TrustTrailReviews - Unified OP Sepolia Contract
 * @dev Combined ERC20 TRST Token + Review Platform + Staking System
 * Features automatic reward distribution on review submission
 */
contract TrustTrailReviews is ERC20, ERC20Burnable, AccessControl, ReentrancyGuard, Pausable, Ownable {
    
    // =================== TOKEN CONSTANTS ===================
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 1000000000 * 10**18; // 1 billion tokens initially (full supply)
    
    // =================== REVIEW PLATFORM CONSTANTS ===================
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    
    // =================== TOKEN MINTING ===================
    mapping(address => bool) public minters;
    
    // =================== REVIEW PLATFORM STATE ===================
    
    // Staking system
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public lastRewardClaim;
    uint256 public totalStaked;
    uint256 public constant ANNUAL_REWARD_RATE = 30; // 30% APY
    
    // Review system
    struct Review {
        uint256 id;
        address reviewer;
        string companyName;
        string category;
        string ipfsHash;
        string proofIpfsHash;
        uint8 rating;
        uint256 upvotes;
        uint256 downvotes;
        uint256 timestamp;
        ReviewStatus status;
        mapping(address => bool) hasVoted;
    }
    
    struct Comment {
        uint256 id;
        uint256 reviewId;
        address commenter;
        string content;
        uint256 timestamp;
    }
    
    enum ReviewStatus { Pending, Approved, Rejected, Flagged }
    
    mapping(uint256 => Review) public reviews;
    mapping(uint256 => Comment) public comments;
    mapping(address => uint256[]) public userReviews;
    mapping(string => uint256[]) public companyReviews;
    mapping(address => uint256) public userReputations;
    
    uint256 public nextReviewId = 1;
    uint256 public nextCommentId = 1;
    
    // Reward amounts
    uint256 public reviewRewardAmount = 10 * 10**18; // 10 TRST per review
    uint256 public upvoteRewardAmount = 1 * 10**18;  // 1 TRST per upvote received
    
    // Auto-approval settings
    bool public autoApproveReviews = true; // Enable automatic approval and reward distribution
    
    // =================== EVENTS ===================
    
    // Token events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    // Review platform events
    event ReviewSubmitted(uint256 indexed reviewId, address indexed reviewer, string companyName);
    event ReviewApproved(uint256 indexed reviewId, address indexed approver);
    event ReviewRejected(uint256 indexed reviewId, address indexed rejector);
    event ReviewFlagged(uint256 indexed reviewId, address indexed flagger);
    event ReviewUpvoted(uint256 indexed reviewId, address indexed voter);
    event ReviewDownvoted(uint256 indexed reviewId, address indexed voter);
    event CommentAdded(uint256 indexed commentId, uint256 indexed reviewId, address indexed commenter);
    event RewardDistributed(address indexed recipient, uint256 amount, string reason);
    event AutoApprovalToggled(bool enabled, address indexed admin);
    
    // Staking events
    event TokensStaked(address indexed staker, uint256 amount);
    event TokensUnstaked(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 amount);
    
    // =================== MODIFIERS ===================
    
    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Caller is not a minter");
        _;
    }
    
    modifier onlyModerator() {
        require(hasRole(MODERATOR_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender) || msg.sender == owner(), "Caller is not a moderator");
        _;
    }
    
    // =================== CONSTRUCTOR ===================
    
    constructor() ERC20("TrustTrail Token", "TRST") {
        _mint(msg.sender, INITIAL_SUPPLY);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MODERATOR_ROLE, msg.sender);
        minters[msg.sender] = true;
        
        emit MinterAdded(msg.sender);
    }
    
    // =================== TOKEN FUNCTIONS ===================
    
    function mint(address to, uint256 amount) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function addMinter(address minter) external onlyRole(ADMIN_ROLE) {
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    function removeMinter(address minter) external onlyRole(ADMIN_ROLE) {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function bulkTransfer(address[] memory recipients, uint256[] memory amounts) external {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
    
    // =================== REVIEW PLATFORM FUNCTIONS ===================
    
    function submitReview(
        string memory _companyName,
        string memory _category,
        string memory _ipfsHash,
        string memory _proofIpfsHash,
        uint8 _rating
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(bytes(_companyName).length > 0, "Company name required");
        require(bytes(_category).length > 0, "Category required");
        
        uint256 reviewId = nextReviewId++;
        Review storage review = reviews[reviewId];
        
        review.id = reviewId;
        review.reviewer = msg.sender;
        review.companyName = _companyName;
        review.category = _category;
        review.ipfsHash = _ipfsHash;
        review.proofIpfsHash = _proofIpfsHash;
        review.rating = _rating;
        review.timestamp = block.timestamp;
        
        userReviews[msg.sender].push(reviewId);
        companyReviews[_companyName].push(reviewId);
        
        // Auto-approval and instant reward distribution
        if (autoApproveReviews) {
            review.status = ReviewStatus.Approved;
            
            // Distribute reward immediately
            _mint(msg.sender, reviewRewardAmount);
            userReputations[msg.sender] += 10;
            
            emit ReviewApproved(reviewId, address(this)); // Contract as approver
            emit RewardDistributed(msg.sender, reviewRewardAmount, "Auto-approved review submission");
        } else {
            review.status = ReviewStatus.Pending;
        }
        
        emit ReviewSubmitted(reviewId, msg.sender, _companyName);
        return reviewId;
    }
    
    // Manual approval function (for when auto-approval is disabled)
    function approveReview(uint256 _reviewId) external onlyModerator {
        require(_reviewId < nextReviewId, "Review does not exist");
        Review storage review = reviews[_reviewId];
        require(review.status == ReviewStatus.Pending, "Review not pending");
        
        review.status = ReviewStatus.Approved;
        
        // Distribute reward to reviewer (only if not already rewarded)
        _mint(review.reviewer, reviewRewardAmount);
        userReputations[review.reviewer] += 10;
        
        emit ReviewApproved(_reviewId, msg.sender);
        emit RewardDistributed(review.reviewer, reviewRewardAmount, "Manual review approval");
    }
    
    function rejectReview(uint256 _reviewId) external onlyModerator {
        require(_reviewId < nextReviewId, "Review does not exist");
        Review storage review = reviews[_reviewId];
        require(review.status == ReviewStatus.Pending, "Review not pending");
        
        review.status = ReviewStatus.Rejected;
        emit ReviewRejected(_reviewId, msg.sender);
    }
    
    function flagReview(uint256 _reviewId) external onlyModerator {
        require(_reviewId < nextReviewId, "Review does not exist");
        reviews[_reviewId].status = ReviewStatus.Flagged;
        emit ReviewFlagged(_reviewId, msg.sender);
    }
    
    // Toggle auto-approval feature
    function setAutoApproval(bool _enabled) external onlyRole(ADMIN_ROLE) {
        autoApproveReviews = _enabled;
        emit AutoApprovalToggled(_enabled, msg.sender);
    }
    
    function upvoteReview(uint256 _reviewId) external whenNotPaused nonReentrant {
        require(_reviewId < nextReviewId, "Review does not exist");
        Review storage review = reviews[_reviewId];
        require(review.status == ReviewStatus.Approved, "Review not approved");
        require(!review.hasVoted[msg.sender], "Already voted");
        require(review.reviewer != msg.sender, "Cannot vote on own review");
        
        review.hasVoted[msg.sender] = true;
        review.upvotes++;
        
        // Reward the original reviewer
        _mint(review.reviewer, upvoteRewardAmount);
        userReputations[review.reviewer] += 1;
        
        emit ReviewUpvoted(_reviewId, msg.sender);
        emit RewardDistributed(review.reviewer, upvoteRewardAmount, "Review upvote");
    }
    
    function downvoteReview(uint256 _reviewId) external whenNotPaused nonReentrant {
        require(_reviewId < nextReviewId, "Review does not exist");
        Review storage review = reviews[_reviewId];
        require(review.status == ReviewStatus.Approved, "Review not approved");
        require(!review.hasVoted[msg.sender], "Already voted");
        require(review.reviewer != msg.sender, "Cannot vote on own review");
        
        review.hasVoted[msg.sender] = true;
        review.downvotes++;
        
        emit ReviewDownvoted(_reviewId, msg.sender);
    }
    
    function addComment(uint256 _reviewId, string memory _content) external whenNotPaused nonReentrant returns (uint256) {
        require(_reviewId < nextReviewId, "Review does not exist");
        require(bytes(_content).length > 0, "Comment content required");
        require(reviews[_reviewId].status == ReviewStatus.Approved, "Can only comment on approved reviews");
        
        uint256 commentId = nextCommentId++;
        Comment storage comment = comments[commentId];
        
        comment.id = commentId;
        comment.reviewId = _reviewId;
        comment.commenter = msg.sender;
        comment.content = _content;
        comment.timestamp = block.timestamp;
        
        emit CommentAdded(commentId, _reviewId, msg.sender);
        return commentId;
    }
    
    // =================== VIEW FUNCTIONS ===================
    
    function getReview(uint256 _reviewId) external view returns (
        uint256 id,
        address reviewer,
        string memory companyName,
        string memory category,
        string memory ipfsHash,
        string memory proofIpfsHash,
        uint8 rating,
        uint256 upvotes,
        uint256 downvotes,
        uint256 timestamp,
        ReviewStatus status
    ) {
        require(_reviewId < nextReviewId, "Review does not exist");
        Review storage review = reviews[_reviewId];
        
        return (
            review.id,
            review.reviewer,
            review.companyName,
            review.category,
            review.ipfsHash,
            review.proofIpfsHash,
            review.rating,
            review.upvotes,
            review.downvotes,
            review.timestamp,
            review.status
        );
    }
    
    function getUserReviews(address _user) external view returns (uint256[] memory) {
        return userReviews[_user];
    }
    
    function getCompanyReviews(string memory _companyName) external view returns (uint256[] memory) {
        return companyReviews[_companyName];
    }
    
    function getUserReputation(address _user) external view returns (uint256) {
        return userReputations[_user];
    }
    
    function getComment(uint256 _commentId) external view returns (
        uint256 id,
        uint256 reviewId,
        address commenter,
        string memory content,
        uint256 timestamp
    ) {
        require(_commentId < nextCommentId, "Comment does not exist");
        Comment storage comment = comments[_commentId];
        
        return (
            comment.id,
            comment.reviewId,
            comment.commenter,
            comment.content,
            comment.timestamp
        );
    }
    
    // =================== STAKING FUNCTIONS ===================
    
    function stakeTokens(uint256 _amount) external whenNotPaused nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");
        
        // Claim existing rewards before staking more
        if (stakedBalances[msg.sender] > 0) {
            _claimRewards();
        }
        
        _transfer(msg.sender, address(this), _amount);
        stakedBalances[msg.sender] += _amount;
        totalStaked += _amount;
        lastRewardClaim[msg.sender] = block.timestamp;
        
        emit TokensStaked(msg.sender, _amount);
    }
    
    function unstakeTokens(uint256 _amount) external whenNotPaused nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(stakedBalances[msg.sender] >= _amount, "Insufficient staked balance");
        
        // Claim rewards before unstaking
        _claimRewards();
        
        stakedBalances[msg.sender] -= _amount;
        totalStaked -= _amount;
        _transfer(address(this), msg.sender, _amount);
        
        if (stakedBalances[msg.sender] == 0) {
            lastRewardClaim[msg.sender] = 0;
        }
        
        emit TokensUnstaked(msg.sender, _amount);
    }
    
    function claimRewards() external whenNotPaused nonReentrant {
        _claimRewards();
    }
    
    function _claimRewards() internal {
        uint256 rewards = calculateRewards(msg.sender);
        if (rewards > 0) {
            _mint(msg.sender, rewards);
            lastRewardClaim[msg.sender] = block.timestamp;
            emit RewardsClaimed(msg.sender, rewards);
            emit RewardDistributed(msg.sender, rewards, "Staking rewards");
        }
    }
    
    function calculateRewards(address _staker) public view returns (uint256) {
        if (stakedBalances[_staker] == 0 || lastRewardClaim[_staker] == 0) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp - lastRewardClaim[_staker];
        uint256 annualReward = (stakedBalances[_staker] * ANNUAL_REWARD_RATE) / 100;
        uint256 rewards = (annualReward * timeStaked) / 365 days;
        
        return rewards;
    }
    
    function getStakedBalance(address _staker) external view returns (uint256) {
        return stakedBalances[_staker];
    }
    
    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }
    
    // =================== ADMIN FUNCTIONS ===================
    
    function updateRewardAmounts(uint256 _reviewReward, uint256 _upvoteReward) external onlyRole(ADMIN_ROLE) {
        reviewRewardAmount = _reviewReward;
        upvoteRewardAmount = _upvoteReward;
    }
    
    function grantModerator(address _moderator) external onlyRole(ADMIN_ROLE) {
        grantRole(MODERATOR_ROLE, _moderator);
    }
    
    function revokeModerator(address _moderator) external onlyRole(ADMIN_ROLE) {
        revokeRole(MODERATOR_ROLE, _moderator);
    }
}
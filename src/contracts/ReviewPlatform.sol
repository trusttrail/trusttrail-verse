
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract TrustTrailReviews is AccessControl, ReentrancyGuard, Pausable {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    
    // Structs
    struct Review {
        address reviewer;
        string companyName;
        string category;
        string ipfsHash; // IPFS hash for review content
        uint8 rating; // 1-5 rating
        uint256 timestamp;
        uint256 upvotes;
        uint256 downvotes;
        ReviewStatus status;
        string proofIpfsHash; // IPFS hash for proof documents
    }
    
    struct Comment {
        address commenter;
        string content;
        uint256 timestamp;
        uint256 reviewId;
    }
    
    enum ReviewStatus {
        Pending,
        Approved,
        Rejected,
        Flagged
    }
    
    // State variables
    uint256 public nextReviewId = 1;
    uint256 public nextCommentId = 1;
    uint256 public reviewReward = 10 * 10**18; // 10 tokens per approved review
    uint256 public upvoteReward = 1 * 10**18; // 1 token per upvote received
    
    IERC20 public rewardToken;
    
    // Mappings
    mapping(uint256 => Review) public reviews;
    mapping(uint256 => Comment) public comments;
    mapping(address => uint256[]) public userReviews;
    mapping(address => uint256) public userReputation;
    mapping(uint256 => uint256[]) public reviewComments;
    mapping(address => mapping(uint256 => bool)) public hasVoted; // user => reviewId => voted
    mapping(string => uint256[]) public companyReviews; // company name => review IDs
    mapping(string => uint256[]) public categoryReviews; // category => review IDs
    
    // Events
    event ReviewSubmitted(
        uint256 indexed reviewId,
        address indexed reviewer,
        string companyName,
        string category,
        uint8 rating,
        string ipfsHash,
        uint256 timestamp
    );
    
    event ReviewApproved(uint256 indexed reviewId, address indexed moderator);
    event ReviewRejected(uint256 indexed reviewId, address indexed moderator, string reason);
    event ReviewFlagged(uint256 indexed reviewId, address indexed flagger, string reason);
    
    event ReviewUpvoted(uint256 indexed reviewId, address indexed voter);
    event ReviewDownvoted(uint256 indexed reviewId, address indexed voter);
    
    event CommentAdded(
        uint256 indexed commentId,
        uint256 indexed reviewId,
        address indexed commenter,
        string content,
        uint256 timestamp
    );
    
    event RewardDistributed(address indexed recipient, uint256 amount, string reason);
    
    // Constructor
    constructor(address _rewardToken, address _admin) {
        rewardToken = IERC20(_rewardToken);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }
    
    // Modifiers
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }
    
    modifier onlyModerator() {
        require(hasRole(MODERATOR_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), "Caller is not a moderator");
        _;
    }
    
    // Main Functions
    function submitReview(
        string memory _companyName,
        string memory _category,
        string memory _ipfsHash,
        string memory _proofIpfsHash,
        uint8 _rating
    ) external whenNotPaused nonReentrant {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(bytes(_companyName).length > 0, "Company name cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_proofIpfsHash).length > 0, "Proof IPFS hash cannot be empty");
        
        uint256 reviewId = nextReviewId++;
        
        Review storage newReview = reviews[reviewId];
        newReview.reviewer = msg.sender;
        newReview.companyName = _companyName;
        newReview.category = _category;
        newReview.ipfsHash = _ipfsHash;
        newReview.proofIpfsHash = _proofIpfsHash;
        newReview.rating = _rating;
        newReview.timestamp = block.timestamp;
        newReview.status = ReviewStatus.Pending;
        
        // Update mappings
        userReviews[msg.sender].push(reviewId);
        companyReviews[_companyName].push(reviewId);
        categoryReviews[_category].push(reviewId);
        
        emit ReviewSubmitted(reviewId, msg.sender, _companyName, _category, _rating, _ipfsHash, block.timestamp);
    }
    
    function approveReview(uint256 _reviewId) external onlyModerator {
        require(_reviewId < nextReviewId, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Pending, "Review is not pending");
        
        reviews[_reviewId].status = ReviewStatus.Approved;
        
        // Distribute reward to reviewer
        _distributeReward(reviews[_reviewId].reviewer, reviewReward, "Review approval reward");
        
        emit ReviewApproved(_reviewId, msg.sender);
    }
    
    function rejectReview(uint256 _reviewId, string memory _reason) external onlyModerator {
        require(_reviewId < nextReviewId, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Pending, "Review is not pending");
        
        reviews[_reviewId].status = ReviewStatus.Rejected;
        
        emit ReviewRejected(_reviewId, msg.sender, _reason);
    }
    
    function flagReview(uint256 _reviewId, string memory _reason) external {
        require(_reviewId < nextReviewId, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Approved, "Review is not approved");
        
        reviews[_reviewId].status = ReviewStatus.Flagged;
        
        emit ReviewFlagged(_reviewId, msg.sender, _reason);
    }
    
    function upvoteReview(uint256 _reviewId) external whenNotPaused {
        require(_reviewId < nextReviewId, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Approved, "Review is not approved");
        require(reviews[_reviewId].reviewer != msg.sender, "Cannot vote on own review");
        require(!hasVoted[msg.sender][_reviewId], "Already voted on this review");
        
        reviews[_reviewId].upvotes++;
        hasVoted[msg.sender][_reviewId] = true;
        userReputation[reviews[_reviewId].reviewer]++;
        
        // Reward the reviewer for getting an upvote
        _distributeReward(reviews[_reviewId].reviewer, upvoteReward, "Upvote reward");
        
        emit ReviewUpvoted(_reviewId, msg.sender);
    }
    
    function downvoteReview(uint256 _reviewId) external whenNotPaused {
        require(_reviewId < nextReviewId, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Approved, "Review is not approved");
        require(reviews[_reviewId].reviewer != msg.sender, "Cannot vote on own review");
        require(!hasVoted[msg.sender][_reviewId], "Already voted on this review");
        
        reviews[_reviewId].downvotes++;
        hasVoted[msg.sender][_reviewId] = true;
        
        emit ReviewDownvoted(_reviewId, msg.sender);
    }
    
    function addComment(uint256 _reviewId, string memory _content) external whenNotPaused {
        require(_reviewId < nextReviewId, "Review does not exist");
        require(reviews[_reviewId].status == ReviewStatus.Approved, "Review is not approved");
        require(bytes(_content).length > 0, "Comment cannot be empty");
        
        uint256 commentId = nextCommentId++;
        
        Comment storage newComment = comments[commentId];
        newComment.commenter = msg.sender;
        newComment.content = _content;
        newComment.timestamp = block.timestamp;
        newComment.reviewId = _reviewId;
        
        reviewComments[_reviewId].push(commentId);
        
        emit CommentAdded(commentId, _reviewId, msg.sender, _content, block.timestamp);
    }
    
    // Internal function to distribute rewards
    function _distributeReward(address _recipient, uint256 _amount, string memory _reason) internal {
        if (rewardToken.balanceOf(address(this)) >= _amount) {
            require(rewardToken.transfer(_recipient, _amount), "Token transfer failed");
            emit RewardDistributed(_recipient, _amount, _reason);
        }
    }
    
    // View functions
    function getReview(uint256 _reviewId) external view returns (Review memory) {
        require(_reviewId < nextReviewId, "Review does not exist");
        return reviews[_reviewId];
    }
    
    function getCompanyReviews(string memory _companyName) external view returns (uint256[] memory) {
        return companyReviews[_companyName];
    }
    
    function getCategoryReviews(string memory _category) external view returns (uint256[] memory) {
        return categoryReviews[_category];
    }
    
    function getUserReviews(address _user) external view returns (uint256[] memory) {
        return userReviews[_user];
    }
    
    function getReviewComments(uint256 _reviewId) external view returns (uint256[] memory) {
        return reviewComments[_reviewId];
    }
    
    function getComment(uint256 _commentId) external view returns (Comment memory) {
        require(_commentId < nextCommentId, "Comment does not exist");
        return comments[_commentId];
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
        require(rewardToken.transfer(msg.sender, _amount), "Token withdrawal failed");
    }
    
    function emergencyWithdraw() external onlyAdmin {
        uint256 balance = rewardToken.balanceOf(address(this));
        require(rewardToken.transfer(msg.sender, balance), "Emergency withdrawal failed");
    }
    
    // Add receive and fallback functions to handle Ether transfers
    receive() external payable {
        // This function is called when contract receives Ether
        // For this contract, we don't need to handle Ether, so we can just accept it
    }
    
    fallback() external payable {
        // This function is called when contract receives data that doesn't match any function
        // For this contract, we don't need to handle arbitrary calls, so we can just accept them
    }
}

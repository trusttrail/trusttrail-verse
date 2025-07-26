// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract TokenSwap is Ownable, ReentrancyGuard, Pausable {
    // Supported tokens
    mapping(address => bool) public supportedTokens;
    mapping(address => string) public tokenSymbols;
    
    // Events
    event TokenSwapped(
        address indexed user,
        address indexed fromToken,
        address indexed toToken,
        uint256 fromAmount,
        uint256 toAmount,
        uint256 timestamp
    );
    
    event TokenAdded(address indexed token, string symbol);
    event TokenRemoved(address indexed token);
    event LiquidityAdded(address indexed token, uint256 amount);
    event LiquidityRemoved(address indexed token, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    // Add supported token
    function addToken(address _token, string memory _symbol) external onlyOwner {
        supportedTokens[_token] = true;
        tokenSymbols[_token] = _symbol;
        emit TokenAdded(_token, _symbol);
    }
    
    // Remove supported token
    function removeToken(address _token) external onlyOwner {
        supportedTokens[_token] = false;
        emit TokenRemoved(_token);
    }
    
    // Add liquidity for swaps (owner adds tokens to contract for swapping)
    function addLiquidity(address _token, uint256 _amount) external onlyOwner {
        require(supportedTokens[_token], "Token not supported");
        require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        emit LiquidityAdded(_token, _amount);
    }
    
    // Swap tokens (simplified fixed-rate swap for testnet)
    function swapToken(
        address _fromToken,
        address _toToken,
        uint256 _fromAmount
    ) external whenNotPaused nonReentrant {
        require(supportedTokens[_fromToken] || _fromToken == address(0), "From token not supported");
        require(supportedTokens[_toToken] || _toToken == address(0), "To token not supported");
        require(_fromAmount > 0, "Amount must be greater than 0");
        
        // Calculate swap amount (simplified 1:1 rate for testnet)
        uint256 toAmount = _fromAmount;
        
        // Handle native MATIC (address(0)) swaps
        if (_fromToken == address(0)) {
            // Swapping MATIC for token
            require(msg.value == _fromAmount, "Incorrect MATIC amount");
            require(IERC20(_toToken).balanceOf(address(this)) >= toAmount, "Insufficient contract balance");
            require(IERC20(_toToken).transfer(msg.sender, toAmount), "Token transfer failed");
        } else if (_toToken == address(0)) {
            // Swapping token for MATIC
            require(address(this).balance >= toAmount, "Insufficient MATIC in contract");
            require(IERC20(_fromToken).transferFrom(msg.sender, address(this), _fromAmount), "Token transfer failed");
            payable(msg.sender).transfer(toAmount);
        } else {
            // Token to token swap
            require(IERC20(_fromToken).transferFrom(msg.sender, address(this), _fromAmount), "From token transfer failed");
            require(IERC20(_toToken).balanceOf(address(this)) >= toAmount, "Insufficient to token balance");
            require(IERC20(_toToken).transfer(msg.sender, toAmount), "To token transfer failed");
        }
        
        emit TokenSwapped(msg.sender, _fromToken, _toToken, _fromAmount, toAmount, block.timestamp);
    }
    
    // Get contract token balance
    function getTokenBalance(address _token) external view returns (uint256) {
        if (_token == address(0)) {
            return address(this).balance;
        }
        return IERC20(_token).balanceOf(address(this));
    }
    
    // Emergency functions
    function withdrawToken(address _token, uint256 _amount) external onlyOwner {
        require(IERC20(_token).transfer(msg.sender, _amount), "Transfer failed");
        emit LiquidityRemoved(_token, _amount);
    }
    
    function withdrawMatic(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient MATIC balance");
        payable(msg.sender).transfer(_amount);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Allow contract to receive MATIC
    receive() external payable {}
}
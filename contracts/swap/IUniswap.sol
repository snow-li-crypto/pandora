// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IUniswap {
    // function swapExactETHForTokens(
    //     uint amountOutMin,
    //     address[] calldata path,
    //     address to,
    //     uint deadline
    // ) external payable returns (uint[] memory amounts);

    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function WETH() external pure returns (address);

    function approve(address spender, uint256 amount) external returns (bool);
}

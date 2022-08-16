// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;


interface ITtoken  {
    function mint(uint mintAmount) external returns (uint);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function borrow(uint borrowAmount) external returns (uint);


    function repayBehalf(address borrower) external payable;

    function redeem(uint redeemTokens) external returns (uint);

    function balanceOf(address account) external view returns (uint256);

    function underlying() external returns(address);
}

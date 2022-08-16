// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Lock{

    uint internal unlocked = 1;

    modifier lock() {
        require(unlocked == 1, 'UniswapV2: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }
}
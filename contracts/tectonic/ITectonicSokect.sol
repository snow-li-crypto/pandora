// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface ITectonicSokect {
    
    function checkMembership(address account, address tToken)
        external
        view
        returns (bool);

    function enterMarkets(address[] calldata tTokens)
        external
        returns (uint[] memory);
}

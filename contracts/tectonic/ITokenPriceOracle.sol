// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./ITtoken.sol";

interface ITokenPriceOracle {
    
    function getUnderlyingPrice(address tToken) external view returns (uint);

}
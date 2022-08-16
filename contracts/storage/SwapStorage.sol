// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "../swap/IUniswap.sol";

contract SwapStorage {
    

    address constant VVS_ROUTER_ADDR = 0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae;

    IUniswap constant  VVS_ROUTER_CONTRACT = IUniswap(VVS_ROUTER_ADDR);

}

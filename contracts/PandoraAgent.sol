// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./PandoraCore.sol";

contract PandoraAgent {
    mapping(address => address) agentMapping;

    function createAgent() external {
        if (agentMapping[msg.sender] == address(0)) {
            PandoraCore core = new PandoraCore(msg.sender);
            agentMapping[msg.sender] = address(core);
        }
    }

    function getAgent() external view returns (address) {
        return agentMapping[msg.sender];
    }
}

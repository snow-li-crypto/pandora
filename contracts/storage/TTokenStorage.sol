// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "../tectonic/ITokenPriceOracle.sol";

contract TTokenStorage {

    

    mapping(address => address) internal marketTtokenMapping;

    constructor() {
        // DAI -> tDAI
        marketTtokenMapping[
            0xF2001B145b43032AAF5Ee2884e456CCd805F677D
        ] = 0xE1c4c56f772686909c28C319079D41adFD6ec89b;

        //USDC -> tUSDC
        marketTtokenMapping[
            0xc21223249CA28397B4B6541dfFaEcC539BfF0c59
        ] = 0xB3bbf1bE947b245Aef26e3B6a9D777d7703F4c8e;
    }

    address constant tectonicSocketAddr =
        0xb3831584acb95ED9cCb0C11f677B5AD01DeaeEc0;

    
    ITokenPriceOracle constant tokenOracleAddr = ITokenPriceOracle(0xD360D8cABc1b2e56eCf348BFF00D2Bd9F658754A);

    enum Error {
        NO_ERROR
    }

}

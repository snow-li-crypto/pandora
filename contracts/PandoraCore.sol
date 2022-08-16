// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./storage/TTokenStorage.sol";
import "./base/PandoraToken.sol";
import "./base/Lock.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./tectonic/ITtoken.sol";
import "./tectonic/ITectonicSokect.sol";
import "hardhat/console.sol";
import "./storage/SwapStorage.sol";

contract PandoraCore is TTokenStorage, PandoraToken, Lock, SwapStorage {
    using SafeMath for uint;

    /**
     *
     */
    function mint(
        address marketToken,
        address borrowTtoken,
        uint amount
    ) external lock {
        address tTokenAddr = marketTtokenMapping[marketToken];
        require(tTokenAddr != address(0), "invaild marketToken");
        require(amount > 0, "invaild amount");

        ERC20 marketTokenERC20 = bulidErc20Contract(marketToken);

        //check balance of holdToken
        require(
            marketTokenERC20.balanceOf(msg.sender) >= amount,
            "Insufficient Balance"
        );

        //approval
        uint allowance = marketTokenERC20.allowance(msg.sender, address(this));
        require(allowance >= amount, "insufficient approval");
        if (marketTokenERC20.allowance(address(this), tTokenAddr) < allowance) {
            marketTokenERC20.approve(tTokenAddr, allowance);
        }

        //transferFrom
        bool transferFromResult = marketTokenERC20.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        console.log("transferFromResult: %s", transferFromResult);
        require(transferFromResult, "transferFrom faild");

        /**
         *
         */
        require(doSupply(tTokenAddr, amount) == 0, "mint faild!");
        console.log("doSupply: success");

        //check enter market
        ITectonicSokect iTectonicSokect = ITectonicSokect(tectonicSocketAddr);
        if (!iTectonicSokect.checkMembership(address(this), tTokenAddr))
            doEnterMarkets(iTectonicSokect, tTokenAddr);
        console.log("doEnterMarkets: success");

        uint supplyTtokenPrice = tokenOracleAddr.getUnderlyingPrice(tTokenAddr);
        uint borrowTtokenPrice = tokenOracleAddr.getUnderlyingPrice(
            borrowTtoken
        );
        uint borrowAmount = SafeMath.div(
            supplyTtokenPrice * amount,
            borrowTtokenPrice
        );
        borrowAmount = SafeMath.div(borrowAmount, uint(2));
        console.log("borrowAmount: %s", borrowAmount);

        /**
         * borrow target
         */
        require(
            ITtoken(borrowTtoken).borrow(borrowAmount) == 0,
            "borrow faild!"
        );
        console.log("borrow: success");

        // VVS_ROUTER_CONTRACT.approve();
        uint deadline = block.timestamp + 300;
        address[] memory path = new address[](2);
        path[0] = VVS_ROUTER_CONTRACT.WETH();
        path[1] = marketToken;
        console.log(path[0]);
        VVS_ROUTER_CONTRACT.swapExactETHForTokens{value: borrowAmount}(
            0,
            path,
            msg.sender,
            deadline
        );
    }

    function repayAndredeem(address borrowAddr, address assetAddr)
        external
        payable
        lock
    {
        require(msg.value > 0, "invalid msg.value");

        console.log(msg.value);
        ITtoken repayITtoken = ITtoken(borrowAddr);
        repayITtoken.repayBehalf{value: msg.value}(address(this));

        console.log("assetAddr:", assetAddr);
        ITtoken assetIToken = ITtoken(assetAddr);
        uint balance = assetIToken.balanceOf(address(this));
        require(balance > 0, "asset balance must be greater than zero");
        console.log("balance: ", balance);
        assetIToken.redeem(balance);

        address underlyingAddr = assetIToken.underlying();
        ITtoken underlyingToken = ITtoken(underlyingAddr);
        uint tokenBalance = underlyingToken
            .balanceOf(address(this));
        console.log("tokenBalance: ", tokenBalance);

        require(tokenBalance > 0, "token balance must be greater than zero");
        underlyingToken.transferFrom(
            address(this),
            msg.sender,
            tokenBalance
        );
    }

    /**
     *
     */
    function doEnterMarkets(ITectonicSokect iTectonicSokect, address tToken)
        internal
    {
        address[] memory tTokens = new address[](1);
        tTokens[0] = tToken;
        uint[] memory results = iTectonicSokect.enterMarkets(tTokens);
        for (uint i = 0; i < results.length; i++) {
            require(results[i] == uint(Error.NO_ERROR));
        }
    }

    /**
     *
     * e.g
     *
     *
     */
    function doSupply(address tTokenAddr, uint amount) internal returns (uint) {
        return ITtoken(tTokenAddr).mint(amount);
    }

    /**
     *
     */
    function bulidErc20Contract(address tokenAddr)
        internal
        pure
        returns (ERC20)
    {
        return ERC20(tokenAddr);
    }

    receive() external payable {
        console.log("receive-------");
        console.log(msg.sender);
        console.log(msg.value);
    }
}

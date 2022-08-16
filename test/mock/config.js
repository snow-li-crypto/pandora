// const { ethers } = require('hardhat');
// const amount = ethers.utils.parseUnits("100", 18);
// import { ethers } from "ethers";
// const amount = ethers.utils.parseUnits("100", 18);
// const amount = 100;
const tokens = {
    "dai": {
        holder: "0xea01e309146551a67366fe9943E9Ed83Ae564057",
        token: "0xF2001B145b43032AAF5Ee2884e456CCd805F677D",
        tToken: "0xE1c4c56f772686909c28C319079D41adFD6ec89b",
        tTokenProxy: "0xC8218136105eff36c602771459825e0D7E7E2400"
    },
    "usdc": {
        holder: "0xea01e309146551a67366fe9943E9Ed83Ae564057",
        token: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
        tToken: "0xB3bbf1bE947b245Aef26e3B6a9D777d7703F4c8e"
    }
};

module.exports = {
    
    tokens: tokens,
    testConfig: {
        addr: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        addr1: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        contractAddr: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
        borrowAddr: "0xeAdf7c01DA7E93FdB5f16B0aa9ee85f978e89E95",
        tonicSocketAddr: "0xb3831584acb95ED9cCb0C11f677B5AD01DeaeEc0",
        repayAddr : "0xeb1E3D204B10E937d71E709673E65AF2bB0AF6F9",
        amount: "100",
        symbol: "dai",
        token: function(){
            return tokens[this.symbol].token;
        },
        tToken: function(){
            return tokens[this.symbol].tToken;
        },
        holder: function(){
            return tokens[this.symbol].holder;
        }
    },
    tokenABI: [
        "function transfer(address to, uint256 amount) public  returns (bool)",
        "function balanceOf(address account) public view  returns (uint256)",
        // "function approve(address guy) external returns (bool)",
        "function approve(address guy, uint wad) public stoppable returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function symbol() public view returns (string memory)",
        "function getAssetsIn(address account) external view returns (address[] memory)",
        "function mint( address marketToken, address borrowTtoken, uint amount ) external",
        "function borrowBalanceStored(address account) public view returns (uint)",
        "function repayAndredeem(address borrowAddr, address redeemAddr) external payable",
        "function repayBehalf(address borrower) public payable",
        "function redeem(uint redeemTokens) external returns (uint)"
    ],
    webTokens: ["0xF2001B145b43032AAF5Ee2884e456CCd805F677D", "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59"]

}

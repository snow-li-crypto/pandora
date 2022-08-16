const { ethers } = require('hardhat');
const { testConfig, tokens, tokenABI } = require('./config.js');

async function allowance(contractAddr,  owner, spender) {
    const ownerSigner = await ethers.getSigner(owner)
    const contract = new ethers.Contract(contractAddr, tokenABI, ownerSigner);

    let httpProvider = new ethers.providers.JsonRpcProvider();
    let gasPrice = await httpProvider.getGasPrice();
    const options = { gasLimit: 230000, gasPrice: gasPrice, value: 0 };

    const result = await contract.allowance(owner, spender,  options);

    console.log("--allowance contract: %s--------------------------------------------------------", contractAddr);
    console.log("owner : %s", owner);
    console.log("spender : %s", spender);
    console.log("allowance : %s", result);
    console.log("\n");
}

// allowance( testConfig.token(), testConfig.addr, testConfig.contractAddr );
module.exports = {
    allowance: allowance
}
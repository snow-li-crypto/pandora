const { ethers } = require('hardhat');
const {testConfig, tokens, tokenABI} = require('./config.js');


async function balanceOf(contractAddr,  accountAddr){
    const testSigner = await ethers.getSigner(accountAddr);

    const tokenContract = new ethers.Contract(contractAddr, tokenABI, testSigner);
    const balance =  await tokenContract.balanceOf(accountAddr);

    console.log("--contractAddr: %s--------------------------------------------------------", contractAddr);
    console.log("addr: %s, balanceOf: %s , symbol: %s", accountAddr, balance, testConfig.symbol);
    // console.log("--contractAddr: %s----------------end----------------------------------------", contractAddr);
    console.log("\n");
}

module.exports = {
    balanceOf: balanceOf
}

const accountAddr = testConfig.addr;
const pandoraAddr = testConfig.contractAddr;

balanceOf(tokens[testConfig.symbol].token, accountAddr);
balanceOf(tokens[testConfig.symbol].token, pandoraAddr);
balanceOf(tokens[testConfig.symbol].tToken, pandoraAddr);

// balanceOf(testConfig.borrowAddr, pandoraAddr);
// balanceOf(owner, accountAddr);


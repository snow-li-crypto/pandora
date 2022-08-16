const { ethers } = require('hardhat');
const {testConfig, tokens, tokenABI} = require('./config.js');



async function transfer(symbol, accountAddr, amount){
    const contractOwnerAddress = tokens[symbol].holder;
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [contractOwnerAddress],
    });

    const contractOwner = await ethers.getSigner(contractOwnerAddress)
    const tokenContract = new ethers.Contract(tokens[symbol].token, tokenABI, contractOwner);

    await tokenContract.approve(accountAddr, amount);
    await tokenContract.transfer(accountAddr, amount);
    

}


// const accountAddr = testConfig.addr;
// transfer(testConfig.symbol, accountAddr, testConfig.amount);
module.exports = {
    transfer: transfer
}

// const amount = ethers.utils.parseUnits(testConfig.amount, 18);
// await transfer(testConfig.symbol, testConfig.addr, amount);
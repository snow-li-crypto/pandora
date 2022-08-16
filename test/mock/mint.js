const { ethers } = require('hardhat');
const { testConfig, tokens, tokenABI } = require('./config.js');



const accountAddr = testConfig.addr;



async function mint(accountAddr, amount) {
    const testSigner = await ethers.getSigner(accountAddr)
    const tokenContract = new ethers.Contract(tokens[testConfig.symbol].tToken, tokenABI, testSigner);

    let httpProvider = new ethers.providers.JsonRpcProvider();
    let gasPrice = await httpProvider.getGasPrice();
    const options = { gasLimit: 230000, gasPrice: gasPrice, value: 0 };

    const result = await tokenContract.mint(amount, options);
    console.log("accountAddr: %s, mint: %s", accountAddr, result);
    console.log(await result.wait()); 
}

mint(accountAddr, testConfig.amount);
const { ethers } = require('hardhat');
const { testConfig, tokens, tokenABI } = require('./config.js');


async function mint(accountAddr) {
    const testSigner = await ethers.getSigner(accountAddr)
    const tokenContract = new ethers.Contract(testConfig.contractAddr, tokenABI, testSigner);

    let httpProvider = new ethers.providers.JsonRpcProvider();
    let gasPrice = await httpProvider.getGasPrice();
    


    const contract = new ethers.Contract( testConfig.borrowAddr,
        tokenABI,
        testSigner
      );  
    var bowrrowAmount =  await contract.borrowBalanceStored(testConfig.contractAddr);  
    console.log("bowrrowAmount: ", bowrrowAmount.toString());
    // const amount = ethers.utils.parseUnits("5", 16);
    // bowrrowAmount = bowrrowAmount.add(amount);
    console.log("bowrrowAmount: ", bowrrowAmount.toString());

    const options = { gasLimit: 930000, gasPrice: gasPrice, value: bowrrowAmount };

    const result = await tokenContract.repayAndredeem(testConfig.repayAddr, testConfig.tToken(), options);  
    console.log("accountAddr: %s, mint: %s", accountAddr, result);
    console.log(await result.wait()); 
}

mint(testConfig.addr);
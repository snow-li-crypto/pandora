const { testConfig, tokens, tokenABI } = require('./config.js');



async function approve( contractAddr,spender, ownerAddr) {
    const ownerSigner = await ethers.getSigner(ownerAddr)
    const tokenContract = new ethers.Contract(contractAddr, tokenABI, ownerSigner);
    await tokenContract.approve(spender, ethers.utils.parseUnits("1", 40));
}

// approve();

module.exports = {
    approve: approve
}

// const accountAddr = testConfig.addr;
// const pandoraAddr = testConfig.contractAddr;
// approve(pandoraAddr, accountAddr);
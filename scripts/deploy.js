const { ethers } = require('hardhat');
const { testConfig} = require('../test/mock/config');

async function deployContract(contractName){
    const contractFactory = await ethers.getContractFactory(contractName)
    const contract = await contractFactory.deploy()
    await contract.deployed()
    console.log("%s deployed to:  %s",contractName,  contract.address)
}

const main = async() => {
    // await deployContract("ShortSale");
    // await deployContract("PandoraCore");

    await deployContract("PandoraAgent");
}
const runMain = async() => {
    try {
        await main()
        process.exit(0)
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
}
runMain()

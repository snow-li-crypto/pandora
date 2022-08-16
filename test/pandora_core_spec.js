const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { testConfig } = require('./mock/config');
const transfer = require("./mock/transfer");
const approve = require("./mock/approve");

describe("PandoraCore", function () {



    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deployFixture(addr) {
        const PandoraCore = await ethers.getContractFactory("PandoraCore");
        pandoraCore = await PandoraCore.deploy();
        return pandoraCore;
    }

    // const pandoraCore = deployFixture();

    before(function () {
        console.log("before-------------");
        // await deployFixture();
    });

    describe("mint", function () {


        it("mint invaild marketToken", async function () {
            const pandoraContract = await bulidPandoraContract();
            console.log(testConfig);
            try {
                const amount = ethers.utils.parseUnits(testConfig.amount, 18);
                await pandoraContract.mint("0xA683fdfD9286eeDfeA81CF6dA14703DA683c44E5", testConfig.borrowAddr, amount, bulidOptions());
                expect(true).to.eq(false);
            } catch (error) {
                expect(error.message).to.include('invaild marketToken');
            }
        });

        it("mint invaild amount", async function () {
            const pandoraContract = await bulidPandoraContract();
            console.log(testConfig);
            try {
                await pandoraContract.mint(testConfig.token(), testConfig.borrowAddr, 0, bulidOptions());
                expect(true).to.eq(false);
            } catch (error) {
                expect(error.message).to.include('invaild amount');
            }
        });

        it("mint Insufficient Balance", async function () {
            const pandoraContract = await bulidPandoraContract(testConfig.addr1);
            console.log(testConfig);
            try {
                const amount = ethers.utils.parseUnits(testConfig.amount, 18);
                await pandoraContract.mint(testConfig.token(), testConfig.borrowAddr, amount, bulidOptions());
                expect(true).to.eq(false);
            } catch (error) {
                expect(error.message).to.include('Insufficient Balance');
            }
        });

        it("mint insufficient approval", async function () {
            const pandoraContract = await bulidPandoraContract();
            console.log(testConfig);
            try {

                const amount = ethers.utils.parseUnits(testConfig.amount, 18);

                await transfer.transfer(testConfig.symbol, testConfig.addr, amount);
                await pandoraContract.mint(testConfig.token(), testConfig.borrowAddr, amount, bulidOptions());
                expect(true).to.eq(false);
            } catch (error) {
                expect(error.message).to.include('insufficient approval');
            }
        });

        it("mint success", async function () {
            // const pandoraContract = await bulidPandoraContract();
            // console.log(testConfig);
            // try {

            //     const amount = ethers.utils.parseUnits(testConfig.amount, 18);

            //     await transfer.transfer(testConfig.symbol, testConfig.addr, amount);
            //     await approve.approve(testConfig.token(), pandoraContract.address, testConfig.addr);
            //     await pandoraContract.mint(testConfig.token(), testConfig.borrowAddr, amount, bulidOptions());
            //     // expect(true).to.eq(false);
            // } catch (error) {
            //     console.log(error.message);
            //     expect(true).to.eq(false);
            // }
        });
    });


    describe("repayAndredeem", function () {


        it("repayAndredeem invalid msg.value", async function () {
            const pandoraContract = await bulidPandoraContract();
            console.log(testConfig);
            try {
                await pandoraContract.repayAndredeem( testConfig.repayAddr, testConfig.tToken(), bulidOptions() );
                expect(true).to.eq(false);
            } catch (error) {
                // console.log(error.message);
                expect(error.message).to.include('invalid msg.value');
            }
        });

        

    });

    async function bulidOptions(gasLimit) {
        let httpProvider = new ethers.providers.JsonRpcProvider();
        let gasPrice = await httpProvider.getGasPrice();
        const options = { gasLimit: gasLimit || 23000, gasPrice: gasPrice, value: 0 };
        return options;
    }

    async function bulidPandoraContract(addr) {
        var pandoraCore = await deployFixture();
        let addrSigner = await ethers.getSigner(addr || testConfig.addr)
        pandoraCore = await pandoraCore.connect(addrSigner);
        return pandoraCore;
    }


});

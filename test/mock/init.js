const {testConfig, tokens, tokenABI} = require('./config.js');
const {balanceOf} = require('./balanceOf');
const {transfer} = require('./transfer');
const {approve} = require('./approve');
const {allowance} = require('./allowance');


async function main(){

    const accountAddr = testConfig.addr;
    const pandoraAddr = testConfig.contractAddr;

    // await balanceOf(tokens[testConfig.symbol].token, accountAddr);
    // await balanceOf(tokens[testConfig.symbol].token, pandoraAddr);

    const amount = ethers.utils.parseUnits(testConfig.amount, 18);
    await transfer(testConfig.symbol, accountAddr, amount);

    await balanceOf(tokens[testConfig.symbol].token, accountAddr);
    await balanceOf(tokens[testConfig.symbol].token, pandoraAddr);
    await balanceOf(tokens[testConfig.symbol].tToken, pandoraAddr);

    await approve( testConfig.token(), pandoraAddr, accountAddr);

    await allowance( testConfig.token(), testConfig.addr, testConfig.contractAddr );
}

main();
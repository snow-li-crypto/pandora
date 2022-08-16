# Pandora
### A simple dApp with Smart Contract.
Author: Snow.li

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```


-----


## HardHat Environment

### Compiling your Smart Contract 
This will generate artifacts abi needed for your web app
```
npx hardhat compile
```

### Deploying to your Local Hardhat Blockchain
1. Start a Hardhat Node
    ```
    npx hardhat node --fork https://evm-cronos.crypto.org
    ```

2. Open a new terminal and deploy smart contract in the `localhost` network
    ```
    npx hardhat run --network localhost scripts/deploy.js
    ```




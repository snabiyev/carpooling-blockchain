require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider'); 
const { GOERLI_API_URL, SEPOLIA_API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    goerli: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, GOERLI_API_URL),
      network_id: 5,
      gasPrice: 297673597570
    },
    sepolia: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, SEPOLIA_API_URL),
      network_id: 11155111,
      gasPrice: 140000000000
    }
  },
  mocha: {
  },
  compilers: {
    solc: {
      version: "^0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};

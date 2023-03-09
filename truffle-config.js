require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider'); 
const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    goerli: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, API_URL),
      network_id: 5,
      gasPrice: 165060051345
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

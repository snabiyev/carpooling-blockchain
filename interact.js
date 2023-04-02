const contract = require("./build/contracts/PaymentProcessingService.json");
const contract_address = "0x84b7C55A57824979620a1CCb0CFF589155408599"

const abi = contract.abi;
console.log(JSON.stringify(abi))

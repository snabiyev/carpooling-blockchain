const contract = require("./build/contracts/OnboardingService.json");
const contract_address = "0xEe2cc589B68cc5Ef6468a744C00A4421957b1f89"

const abi = contract.abi;
console.log(JSON.stringify(abi))

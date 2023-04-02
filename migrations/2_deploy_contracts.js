const PaymentProcessingService = artifacts.require("PaymentProcessingService");

module.exports = function(deployer) {
  deployer.deploy(PaymentProcessingService);
};

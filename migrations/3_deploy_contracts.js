const CarManagementService = artifacts.require("CarManagementService");

module.exports = function(deployer) {
  deployer.deploy(CarManagementService);
};

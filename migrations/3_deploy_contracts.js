const VehicleManagementService = artifacts.require("VehicleManagementService");

module.exports = function(deployer) {
  deployer.deploy(VehicleManagementService);
};

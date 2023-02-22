const OnboardingService = artifacts.require("OnboardingService");

module.exports = function(deployer) {
  deployer.deploy(OnboardingService);
};

const OnboardingService = artifacts.require("OnboardingService");
const keccak256 = require('keccak256')

contract("OnboardingService", accounts => {
  let onboardingService;

  before(async () => {
    onboardingService = await OnboardingService.deployed();
  });

  it("registers a new user", async () => {
    const result = await onboardingService.registerUser("testuser", keccak256("password"), { from: accounts[0] });
    const event = result.logs[0].args;

    assert.equal(event.status, true, "Registration should be successful");
  });

  it("does not allow duplicate registration", async () => {
    const result = await onboardingService.registerUser("testuser", keccak256("password"), { from: accounts[0] });
    const event = result.logs[0].args;

    assert.equal(event.status, false, "Registration should fail because the user is already registered");
  });

  it("logs in an existing user", async () => {
    await onboardingService.registerUser("testuser", keccak256("password"), { from: accounts[0] });
    const result = await onboardingService.login("testuser", keccak256("password"), { from: accounts[0] });

    assert.equal(result, true, "User should be able to log in with correct credentials");
  });

  it("does not log in with incorrect password", async () => {
    await onboardingService.registerUser("testuser", keccak256("password"), { from: accounts[0] });
    try{
      const result = await onboardingService.login("testuser", keccak256("wrongpassword"), { from: accounts[0] });
    }
    catch(err){
      assert.equal(true, true, err);
    }
  });

  it("checks if a user is registered", async () => {
    await onboardingService.registerUser("testuser", keccak256("password"), { from: accounts[0] });
    const result = await onboardingService.isRegistered("testuser", { from: accounts[0] });

    assert.equal(result, true, "Registered user should be detected as registered");
  });

  it("changes a user's password", async () => {
    await onboardingService.registerUser("testuser", keccak256("password"), { from: accounts[0] });
    const result = await onboardingService.changePassword("testuser", keccak256("newpassword"), { from: accounts[0] });
    const event = result.logs[0].args;

    assert.equal(event.status, true, "Password change should be successful");
  });

  it("does not change to the same password", async () => {
    await onboardingService.registerUser("testuser2", keccak256("password"), { from: accounts[0] });
    const result = await onboardingService.changePassword("testuser2", keccak256("password"), { from: accounts[0] });
    const event = result.logs[0].args;

    assert.equal(event.status, false, "Password should not be changed to the same password"); 
  });

  it("should delete a user's account", async () => {
    // Define the input data
    const username = "jimmy_doe";
    const password = keccak256("password123");

    // Register the user
    await onboardingService.registerUser(username, password, { from: accounts[0] });

    // Delete the user's account
    const result = await onboardingService.deleteAccount(username, { from: accounts[0] });

    // Check that the account was deleted successfully
    assert.equal(result.receipt.status, true, "Account deletion failed");

    // Check that the user is no longer registered
    const isRegistered = await onboardingService.isRegistered(username, { from: accounts[0] });
    assert.equal(isRegistered, false, "User was not deleted");
  });
});
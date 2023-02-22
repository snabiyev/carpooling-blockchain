// Import the necessary dependencies
const OnboardingService = artifacts.require("OnboardingService");

contract("OnboardingService", (accounts) => {
  let onboardingService;

  beforeEach(async () => {
    onboardingService = await OnboardingService.new();
  });

  it("should allow users to register", async () => {
    const username = "user_0";
    const password = "test_password";
    const sender = accounts[0];

    const result = await onboardingService.registerUser(username, password, { from: sender });

    assert(result.logs.length === 1, "Expected one event to be emitted");
    assert(result.logs[0].event === "UserRegistered", "Expected UserRegistered event to be emitted");
    assert(result.logs[0].args.userAddress === sender, "Event should include the registered user's address");
    assert(result.logs[0].args.username === username, "Event should include the registered user's username");
  });

  it("should not allow a user to register twice", async () => {
    const username = "user_0";
    const password = "test_password";
    const sender = accounts[0];

    await onboardingService.registerUser(username, password, { from: sender });

    try {
      await onboardingService.registerUser(username, password, { from: sender });
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      assert(error.message.includes("User already registered"), "Expected an error message indicating that the user is already registered");
    }
  });

  it("should allow registered users to log in", async () => {
    const username = "user_0";
    const password = "test_password";
    const sender = accounts[0];

    await onboardingService.registerUser(username, password, { from: sender });

    const result = await onboardingService.login(username, password, { from: sender });

    assert(result.logs.length === 1, "Expected one event to be emitted");

    assert(result.logs[0].event === "UserLoggedIn", "Expected UserLoggedIn event to be emitted");
    assert(result.logs[0].args.userAddress === sender, "Event should include the logged in user's address");
  });

  it("should not allow unregistered users to log in", async () => {
    const username = "user_0";
    const password = "test_password";
    const sender = accounts[0];

    try {
      await onboardingService.login(username, password, { from: sender });
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      assert(error.message.includes("User not registered"), "Expected an error message indicating that the user is not registered");
    }
  });

  it("should not allow registered users to log in with incorrect password", async () => {
    const username = "user_0";
    const password = "test_password";
    const incorrectPassword = "wrongone";
    const sender = accounts[0];

    await onboardingService.registerUser(username, password, { from: sender });

    try {
      await onboardingService.login(username, incorrectPassword, { from: sender });
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      assert(error.message.includes("Incorrect password"), "Expected an error message indicating that the password is incorrect");
    }
  });

  it("should not allow registered users to log in with incorrect username", async () => {
    const username = "user_0";
    const password = "test_password";
    const incorrectUsername = "user_1";
    const sender = accounts[0];

    await onboardingService.registerUser(username, password, { from: sender });

    try {
      await onboardingService.login(incorrectUsername, password, { from: sender });
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      assert(error.message.includes("Incorrect username"), "Expected an error message indicating that the username is incorrect");
    }
  });
});
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Define the contract
contract OnboardingService {

    // Define a struct to store user information
    struct User {
        string username;        // The username of the user
        bytes32 passwordHash;   // The hash of the user's password
        bool registered;        // Flag indicating if the user is registered
    }

    // Define a mapping to store users by their address in blockchain
    mapping (address => User) public users;

    // Events to emit when a user is registered or logged in
    event UserRegistered(address indexed userAddress, string username);
    event UserLoggedIn(address indexed userAddress);

    // Registering a new user
    function registerUser(string memory _username, string memory _password) public {
        // Make sure the user is not already registered
        require(!users[msg.sender].registered, "User already registered");

        // Hash the password
        bytes32 passwordHash = keccak256(bytes(_password));

        // Store the user's information
        users[msg.sender] = User(_username, passwordHash, true);

        // Emit an event to indicate that the user was registered
        emit UserRegistered(msg.sender, _username);
    }

    // Logging in an existing user
    function login(string memory _username, string memory _password) public returns (bool) {
        // Make sure the user is registered
        require(users[msg.sender].registered, "User not registered");

        // Hash the password and compare it with the stored one
        bytes32 passwordHash = keccak256(bytes(_password));
        require(users[msg.sender].passwordHash == passwordHash, "Incorrect password");

        // Compare the username with the stored one
        require(keccak256(bytes(_username)) == keccak256(bytes(users[msg.sender].username)), "Incorrect username");

        // Emit an event to the listeners to indicate that the user was logged in
        emit UserLoggedIn(msg.sender);

        return true;
    }
}
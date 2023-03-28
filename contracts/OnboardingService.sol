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
        mapping (string => User) public users;

        // Events to emit when a user is registered or logged in
        event RegistrationInfo(string indexed username, bool got_registered, string indexed message);

        // Registering a new user
        function registerUser(string memory _username, string memory _password) public returns (bool) { 
            // Make sure the user is not already registered
            if (users[_username].registered) {
                emit RegistrationInfo(_username, false, "User already registered");
                return false;
            }

            // Hash the password
            bytes32 passwordHash = keccak256(bytes(_password));

            // Store the user's information
            users[_username] = User(_username, passwordHash, true);

            // Emit an event to indicate that the user was registered
            emit RegistrationInfo(_username, users[_username].registered, "User registered successfully!");

            return true;
        }

        // Logging in an existing user
        function login(string memory _username, string memory _password) public view returns (bool) {
            // Make sure the user is registered
            require(users[_username].registered, "User not registered");

            // Hash the password and compare it with the stored one
            bytes32 passwordHash = keccak256(bytes(_password));
            require(users[_username].passwordHash == passwordHash, "Incorrect password");

            // Emit an event to the listeners to indicate that the user was logged in
            return true;
        }
    }
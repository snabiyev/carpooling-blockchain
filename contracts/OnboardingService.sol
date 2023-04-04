    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    // Define the contract
    contract OnboardingService {

        address private owner;

        // Define a struct to store user information
        struct User {
            string username;        // The username of the user
            string email;   
            string phoneNumber;
            bytes32 passwordHash;   // The hash of the user's password
            bool registered;        // Flag indicating if the user is registered
        }

        // Define a mapping to store users by their address in blockchain
        mapping (string => User) public users;

        // Events to emit when a user is registered or logged in
        event RegistrationInfo(string indexed username, bool got_registered, string indexed message);

        constructor(){
            owner = msg.sender;
        }

        modifier onlyOwner(){
            require(msg.sender == owner, "Only the contract owner can interact with this function");
            _;
        }

        // Registering a new user
        function registerUser(string memory _username, string memory _email, 
            string memory _phoneNumber, bytes32 _password) public onlyOwner returns (bool) { 
            // Make sure the user is not already registered
            if (users[_username].registered) {
                emit RegistrationInfo(_username, false, "User already registered");
                return false;
            }

            // Store the user's information
            users[_username] = User(_username, _email, _phoneNumber, _password, true);

            // Emit an event to indicate that the user was registered
            emit RegistrationInfo(_username, users[_username].registered, "User registered successfully!");

            return true;
        }

        // Logging in an existing user
        function login(string memory _username, bytes32 _password) public view onlyOwner returns (bool) {
            // Make sure the user is registered
            require(users[_username].registered, "User not registered");
            require(users[_username].passwordHash == _password, "Incorrect password");

            // Emit an event to the listeners to indicate that the user was logged in
            return true;
        }

        function transferOwnership(address newOwner) public onlyOwner {
            owner = newOwner;
        }

        function closeContract() public {
            require(msg.sender == owner, "Only the contract owner can call this function.");
            selfdestruct(payable(owner));
        }
    }
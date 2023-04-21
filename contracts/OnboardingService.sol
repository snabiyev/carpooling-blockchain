    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;
 
    // Define the contract
    contract OnboardingService {

        address private owner;

        // Define a struct to store user information
        struct User {
            string username;        // The username of the user
            bytes32 passwordHash;   // The hash of the user's password
            bool registered;        // Flag indicating if the user is registered
        }

        // Define a mapping to store users by their address in blockchain
        mapping (string => User) private users;

        // Events to emit when a user is registered or logged in
        event RegistrationInfo(string indexed username, bool status, string message);
        event PasswordChangeInfo(string indexed username,  bool status, string message);
        event AccountDeletionInfo(string indexed username, bool status, string message);

        constructor(){
            owner = msg.sender;
        }

        // Registering a new user
        function registerUser(string memory _username, bytes32 _password) public returns (bool) { 
            // Make sure the user is not already registered
            if (users[_username].registered) {
                emit RegistrationInfo(_username, false, "User already registered");
                return false;
            }

            // Store the user's information
            users[_username] = User(_username, _password, true);

            // Emit an event to indicate that the user was registered
            emit RegistrationInfo(_username, users[_username].registered, "User registered successfully!");

            return true;
        }

        // Logging in an existing user
        function login(string memory _username, bytes32 _password) public view returns (bool) {
            // Make sure the user is registered
            require(users[_username].registered, "User not registered");
            require(users[_username].passwordHash == _password, "Incorrect password");

            // Emit an event to the listeners to indicate that the user was logged in
            return true;
        }

        function changePassword(string memory _username, bytes32 _newPassword) public returns (bool) {
            if (!users[_username].registered){
                emit PasswordChangeInfo(_username, false, "User is not registered");
                return false;
            }

            if (users[_username].passwordHash == _newPassword) {
                emit PasswordChangeInfo(_username, false, "Your new password cannot be the same as old password");
                return false;
            }

            users[_username].passwordHash = _newPassword;
            emit PasswordChangeInfo(_username, true, "Password has been changed successfully");
            return true;
        }

        function deleteAccount(string memory _username) public returns (bool) {
            if (!users[_username].registered){
                emit AccountDeletionInfo(_username, false, "User is not registered");
                return false;
            }

            delete users[_username];
            emit AccountDeletionInfo(_username, true, "Account has been removed from the system");
            return true;
        }

        function transferOwnership(address newOwner) public {
            require(msg.sender == owner, "Only the contract owner can call this function.");
            owner = newOwner;
        }
        function closeContract() public {
            require(msg.sender == owner, "Only the contract owner can call this function.");
            selfdestruct(payable(owner));
        }
    }
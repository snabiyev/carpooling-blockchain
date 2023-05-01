// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentProcessingService {

    mapping (address => uint256) balances;

    event Deposit(address indexed from, uint256 value, bool status, string message);
    event Withdraw(address indexed to, uint256 value, bool status, string message);
    event Transfer(address indexed from, address indexed to, uint256 value, bool status, string message);
    
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function balanceOfContract() public view returns (uint256){
        return address(this).balance;
    } 

    function deposit() public payable returns (bool) {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, true, "The amount has been successfully deposited");
        return true;
    }

    function withdraw(uint amount) public returns (bool){
        require(balances[msg.sender] >= amount, "Insufficient funds");
        (bool success, bytes memory data) = (payable(msg.sender)).call{value: amount}("");
        require(success, "Failed to send Ether");
        balances[msg.sender] -= amount;
        emit Withdraw(msg.sender, amount, true, "The amount has been successfully withdrawn");
        return true;
    }

    function processPayment(address[] memory passengers, address payable receiver, uint256 amount) public returns (bool) {
        require(address(this).balance >= amount, "Something unexpected, please try again");
        (bool success, bytes memory data) = receiver.call{value: amount}("");
        require(success, "Failed to send Ether");
        emit Transfer(msg.sender, receiver, amount, true, "You have been paid!");
        for (uint i = 0; i != passengers.length; i++){
            balances[passengers[i]] -= amount/passengers.length;
        } 
        return true;
    }
}

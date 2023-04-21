// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarManagementService {

    address private owner;

    struct Car {
        string license;
        string model;
        string color;
        uint16 year;
    }
    mapping (string => Car[]) userCars;

    event AddCarInformation(string username, Car car, string message);
    event UpdateCarInformation(string username, Car car, string message);
    event DeleteCarInformation(string username, Car car, string message);

    constructor(){
        owner = msg.sender;
    }

    function addCar(string memory _username, Car memory _car) public returns (bool){
        userCars[_username].push(_car);
        emit AddCarInformation(_username, _car, "Car has been saved!");
        return true;
    }

    function getUserCars(string memory _username) public view returns (Car[] memory) {
        return userCars[_username];
    }

    function getUserCar(string memory _username, uint8 index) public view returns (Car memory){
        require(userCars[_username].length > index, "Index error");
        return userCars[_username][index];
    }

    function updateCar(string memory _username, Car memory _car, uint8 index) public returns (bool) {
        require(userCars[_username].length > index, "Index error");
        userCars[_username][index] = _car;
        emit UpdateCarInformation(_username, _car, "Car information has been updated!");
        return true;
    }

    function deleteCar(string memory _username, uint8 index) public returns (bool) {
        require(userCars[_username].length > index, "Index error");
        Car memory car = userCars[_username][index];
        userCars[_username][index] = userCars[_username][userCars[_username].length-1];
        userCars[_username].pop();
        emit DeleteCarInformation(_username, car, "Your car has been removed!");
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
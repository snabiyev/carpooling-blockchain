// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VehicleManagementService {

    address private owner;

    struct Vehicle {
        string license;
        string model;
        string color;
        string year;
    }
    mapping (string => Vehicle[]) userVehicles;

    event AddVehicleInformation(string username, bool status, Vehicle vehicle, string message);
    event UpdateVehicleInformation(string username, bool status, Vehicle vehicle, string message);
    event DeleteVehicleInformation(string username, bool status, Vehicle vehicle, string message);
    event DeleteVehiclesInformation(string username, bool status, string message);

    constructor(){
        owner = msg.sender;
    }

    function addVehicle(string memory _username, Vehicle memory _vehicle) public returns (bool){
        userVehicles[_username].push(_vehicle);
        emit AddVehicleInformation(_username, true, _vehicle, "Vehicle has been saved!");
        return true;
    }

    function getUserVehicles(string memory _username) public view returns (Vehicle[] memory) {
        return userVehicles[_username];
    }

    function getUserVehicle(string memory _username, uint8 index) public view returns (Vehicle memory){
        require(userVehicles[_username].length > index, "Index error");
        return userVehicles[_username][index];
    }

    function updateVehicle(string memory _username, Vehicle memory _vehicle, uint8 index) public returns (bool) {
        require(userVehicles[_username].length > index, "Index error");
        userVehicles[_username][index] = _vehicle;
        emit UpdateVehicleInformation(_username, true, _vehicle, "Vehicle information has been updated!");
        return true;
    }

    function deleteVehicle(string memory _username, uint8 index) public returns (bool) {
        require(userVehicles[_username].length > index, "Index error");
        Vehicle memory vehicle = userVehicles[_username][index];
        userVehicles[_username][index] = userVehicles[_username][userVehicles[_username].length-1];
        userVehicles[_username].pop();
        emit DeleteVehicleInformation(_username, true, vehicle, "Your vehicle has been removed!");
        return true;
    }

    function deleteAllVehicles(string memory _username) public returns (bool) {
        require(userVehicles[_username].length > 0, "No vehicles found");
        delete userVehicles[_username];
        emit DeleteVehiclesInformation(_username, true, "All user vehicles have been removed!");
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
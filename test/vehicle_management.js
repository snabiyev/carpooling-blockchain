const { expect } = require("chai");
const VehicleManagementService = artifacts.require("VehicleManagementService");

contract("VehicleManagementService", (accounts) => {
  let vehicleService;

  beforeEach(async () => {
    vehicleService = await VehicleManagementService.new();
  });

  it("should add a new vehicle for a user", async () => {
    const username = "Alice";
    const vehicle = {
      license: "ABC123",
      model: "Tesla Model 3",
      color: "Red",
      year: "2021"
    };
    const sender = accounts[0];
    const result = await vehicleService.addVehicle(username, vehicle, {from: sender});
    expect(result["receipt"]["status"]).to.be.true;

    const userVehicles = await vehicleService.getUserVehicles(username, {from: sender});
    expect(userVehicles.length).to.equal(1);
    expect(userVehicles[0].license).to.equal(vehicle.license);
  });

  it("should update an existing vehicle information", async () => {
    const username = "Alice";
    const vehicle = {
      license: "ABC123",
      model: "Tesla Model 3",
      color: "Red",
      year: "2021"
    };
    const sender = accounts[0]
    await vehicleService.addVehicle(username, vehicle, {from: sender});

    const updatedVehicle = {
      license: "DEF456",
      model: "Tesla Model Y",
      color: "Blue",
      year: "2022"
    };
    const result = await vehicleService.updateVehicle(username, updatedVehicle, 0, {from: sender});
    expect(result["receipt"]["status"]).to.be.true;

    const userVehicles = await vehicleService.getUserVehicles(username, {from: sender});
    expect(userVehicles.length).to.equal(1);
    expect(userVehicles[0].license).to.equal(updatedVehicle.license);
    expect(userVehicles[0].model).to.equal(updatedVehicle.model);
    expect(userVehicles[0].color).to.equal(updatedVehicle.color);
    expect(userVehicles[0].year).to.equal(updatedVehicle.year);
  });

  it("should delete an existing vehicle", async () => {
    const username = "Alice";
    const vehicle = {
      license: "ABC123",
      model: "Tesla Model 3",
      color: "Red",
      year: "2021"
    };
    const sender = accounts[0]
    await vehicleService.addVehicle(username, vehicle, {from: sender});

    const result = await vehicleService.deleteVehicle(username, 0, {from: sender});
    expect(result["receipt"]["status"]).to.be.true;

    const userVehicles = await vehicleService.getUserVehicles(username, {from: sender});
    expect(userVehicles.length).to.equal(0);
  });
  
  it("should delete all vehicles for a user", async () => {
    const username = "Alice";
    const vehicle1 = {
      license: "ABC123",
      model: "Tesla Model 3",
      color: "Red",
      year: "2021"
    };
    const vehicle2 = {
      license: "DEF456",
      model: "Tesla Model Y",
      color: "Blue",
      year: "2022"
    };
    const sender = accounts[0]
    await vehicleService.addVehicle(username, vehicle1, {from: sender});
    await vehicleService.addVehicle(username, vehicle2, {from: sender});

    const result = await vehicleService.deleteAllVehicles(username, {from: sender});
    expect(result["receipt"]["status"]).to.be.true;

    const userVehicles = await vehicleService.getUserVehicles(username, {from: sender});
    expect(userVehicles.length).to.equal(0);
  });
});
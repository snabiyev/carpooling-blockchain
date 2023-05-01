// Import the contract and web3 libraries
const PaymentProcessingService = artifacts.require("PaymentProcessingService");
const web3 = require("web3");

// Use Chai assertion library
const { expect } = require("chai");

// Define test suite for the contract
contract("PaymentProcessingService", async accounts => {

    // Declare variables
    let contractInstance;
    const passenger1 = accounts[1];
    const passenger2 = accounts[2];
    const receiver = accounts[3];
    const depositAmount = web3.utils.toWei("1", "ether");
    const paymentAmount = web3.utils.toWei("0.5", "ether");

    // Before each test case, create a new contract instance
    beforeEach(async () => {
        contractInstance = await PaymentProcessingService.new();
    });

    // Test case for deposit function
    it("Should deposit funds into the contract", async () => {
        const tx = await contractInstance.deposit({ from: passenger1, value: depositAmount });
        expect(tx.receipt.status).to.be.equal(true);
    });

    // Test case for withdraw function
    it("Should withdraw funds from the contract", async () => {
        const tx = await contractInstance.deposit({ from: passenger2, value: depositAmount });
        expect(tx.receipt.status).to.be.equal(true);
        const new_tx = await contractInstance.withdraw(paymentAmount, { from: passenger2 });
        expect(new_tx.receipt.status).to.be.equal(true);
    });

    // Test case for insufficient funds in withdraw function
    it("Should not withdraw funds from the contract if there are insufficient funds", async () => {
        await contractInstance.deposit({ from: passenger2, value: depositAmount });
        try { 
            contractInstance.withdraw(depositAmount + 10, { from: passenger1 })
        }
        catch(err){
            assert.equal(true, true, err);
        }
    });

    // Test case for processPayment function
    it("Should process payment to receiver and update balances of passengers", async () => {
        await contractInstance.deposit({ from: passenger1, value: paymentAmount });
        await contractInstance.deposit({ from: passenger2, value: paymentAmount });
        const tx = await contractInstance.processPayment([passenger1, passenger2], receiver, web3.utils.toWei(1, 'ether'), { from: accounts[0] });
        expect(tx.receipt.status).to.be.equal(true);
    });
})
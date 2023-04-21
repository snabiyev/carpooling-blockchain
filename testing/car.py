import web3
from web3 import Web3
from uuid import uuid4
import json
import statistics

alchemy_url = "https://eth-sepolia.g.alchemy.com/v2/-pXsZXQcHfJ8lTsoAOvH4IdTMwUmmQM5"
w3 = Web3(Web3.HTTPProvider(alchemy_url))
contract_address = "0xdaA8f3cDF651289ACcf4dFaB37AC10dDAAc95194"
private_key = "09c281b79bbbfc7d50379d8cebcb57a82639b22d9eb7c2d7c3f537ecec85ce54"

def _estimate_gas() -> int:
    # Returns the median of the gas in previous block transactions
    block = w3.eth.get_block("latest", full_transactions=True)
    return int(statistics.median(t.gas for t in block.transactions)) 

with open('car_abi.json', mode="r") as f:
    data = f.read()
abi = json.loads(data)
contract = w3.eth.contract(address=contract_address, abi=abi)

class Car:
    license = ""
    model = ""
    color = ""
    year = 0
    
    def __init__(self, _license, _model, _color, _year):
        self.license = _license
        self.model = _model
        self.color = _color
        self.year = _year

def contract_function(name):
    return contract.functions[name]

def send_transaction(func, params):
    tx = func.buildTransaction(params)
    signed = w3.eth.account.signTransaction(tx, private_key=private_key)
    tx_hash = w3.eth.sendRawTransaction(signed.rawTransaction)
    print(tx_hash.hex())
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return receipt

def addCar(username, car, tx_params):
    try:
        test = contract_function('addCar')(username, car)
        receipt = send_transaction(test, tx_params)
        rich_logs = contract.events.AddCarInformation().processReceipt(receipt)
        print(rich_logs[0]['args'])
    except Exception as e:
        print(e)
        return
    getUserCars(username)
    

def deleteCar(username, index, tx_params):
    test = contract_function('deleteCar')(username, index)
    receipt = send_transaction(test, tx_params)
    print(receipt)
    rich_logs = contract.events.DeleteCarInformation().processReceipt(receipt)
    print(rich_logs)
    print(rich_logs[0]['args'])
    getUserCars(username)

def updateCar(username, car, index, tx_params):
    test = contract_function('updateCar')(username, car, index)
    receipt = send_transaction(test, tx_params)
    rich_logs = contract.events.UpdateCarInformation().processReceipt(receipt)
    print(rich_logs[0]['args'])
    getUserCars(username)

def getUserCar(username, index):
    cars = contract_function('getUserCar')(username, index).call({'from': '0xEC0e46149Afe97FBDd200aF6536Db51B88774660'})
    print(cars)

def getUserCars(username):
    car = contract_function('getUserCars')(username).call({'from': '0xEC0e46149Afe97FBDd200aF6536Db51B88774660'})
    print(car)

def calculate_params():
    return {
    'from': '0xEC0e46149Afe97FBDd200aF6536Db51B88774660',
    'nonce': w3.eth.getTransactionCount('0xEC0e46149Afe97FBDd200aF6536Db51B88774660'),
    'gas': 8000000,
    'gasPrice': 5000
    }  
 
car = ("55AI030", "BMW", "Blue", 2009)
username = "user0"
deleteCar(username, 2, calculate_params())
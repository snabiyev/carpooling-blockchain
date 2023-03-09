# Setup
from web3 import Web3
import json
import time
import asyncio
from Crypto.Hash import keccak
from uuid import uuid4

alchemy_url = "HTTP://127.0.0.1:7545"
w3 = Web3(Web3.HTTPProvider(alchemy_url))

abi = json.loads('[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"username","type":"string"}],"name":"UserLoggedIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"username","type":"string"},{"indexed":false,"internalType":"bool","name":"registered","type":"bool"}],"name":"UserRegistered","type":"event"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"users","outputs":[{"internalType":"string","name":"username","type":"string"},{"internalType":"bytes32","name":"passwordHash","type":"bytes32"},{"internalType":"bool","name":"registered","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"_username","type":"string"},{"internalType":"string","name":"_password","type":"string"}],"name":"registerUser","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_username","type":"string"},{"internalType":"string","name":"_password","type":"string"}],"name":"login","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]')
address = '0xfa9b4C163e7Ec25e794003820E9d9F9B8A72B515'
contract = w3.eth.contract(address=address, abi=abi)

for i in range(10):
    account = w3.eth.accounts[i]

    username = f"user{i}"  
    password = f"password{i}"

    print(username, password)

    tx_hash = contract.functions.registerUser(username, password).transact({'from': account})
    receipt = w3.eth.get_transaction_receipt(tx_hash)
    rich_logs = contract.events.UserRegistered().processReceipt(receipt)
    print(rich_logs[0]['args'])
    time.sleep(4)
    passwordHash = w3.keccak(text=password)
    user = contract.functions.users(username).call()
    assert user[1] == passwordHash
    print("Nice")
    assert user[2] == True
    print("Nice")


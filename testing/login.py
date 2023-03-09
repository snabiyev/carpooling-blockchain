from web3 import Web3
import json
import time
from Crypto.Hash import keccak
from uuid import uuid4

alchemy_url = "https://eth-goerli.g.alchemy.com/v2/IxA9qqpjkT8eG_MYsMGVRitSCadI5T5t"
w3 = Web3(Web3.HTTPProvider(alchemy_url))

with open('contract_abi.json', mode="r") as f:
    data = f.read()
abi = json.loads(data)
address = '0x8DEa0695f763F760A340EB68dd48DE893a59e89a'
contract = w3.eth.contract(address=address, abi=abi)

username = "user8545c0d9-25c3-49b5-8fe6-47c568bcfe69"
password = "password0cfbf763-b696-4b78-ba1b-7f38fa1e0467"
function_name = 'login'
function = contract.functions[function_name]

login = function(username, password).call()

print(login)

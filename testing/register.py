# Setup
from web3 import Web3
import json
import asyncio
from uuid import uuid4
import chardet

alchemy_url = "https://eth-goerli.g.alchemy.com/v2/IxA9qqpjkT8eG_MYsMGVRitSCadI5T5t"
w3 = Web3(Web3.HTTPProvider(alchemy_url))
contract_address = "0x8DEa0695f763F760A340EB68dd48DE893a59e89a"

with open('contract_abi.json', mode="r") as f:
    data = f.read()
abi = json.loads(data)
contract = w3.eth.contract(address=contract_address, abi=abi)

username = f"user{str(uuid4())}"
password = f"password{str(uuid4())}"

print(username, password)
function_name = 'registerUser'
function = contract.functions[function_name]

nonce = w3.eth.getTransactionCount('0xEC0e46149Afe97FBDd200aF6536Db51B88774660')

tx_params = {
    'from': '0xEC0e46149Afe97FBDd200aF6536Db51B88774660',
    'gas': 150000,
    'gasPrice': w3.toWei('130', 'gwei'),
    'nonce': nonce
}
tx = function(username, password).buildTransaction(tx_params)
signed_tx = w3.eth.account.signTransaction(tx, private_key='09c281b79bbbfc7d50379d8cebcb57a82639b22d9eb7c2d7c3f537ecec85ce54')
tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
print(w3.toHex(tx_hash))
#receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
#rich_logs = contract.events.UserRegistered().processReceipt(receipt)
#print(rich_logs[0]['args'])



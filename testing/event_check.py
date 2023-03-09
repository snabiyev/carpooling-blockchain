from web3 import Web3
import json
import asyncio
from uuid import uuid4
import chardet
from datetime import datetime

alchemy_url = "https://eth-goerli.g.alchemy.com/v2/IxA9qqpjkT8eG_MYsMGVRitSCadI5T5t"
w3 = Web3(Web3.HTTPProvider(alchemy_url))
contract_address = "0x8DEa0695f763F760A340EB68dd48DE893a59e89a"

with open('contract_abi.json', mode="r") as f:
    data = f.read()
abi = json.loads(data)
contract = w3.eth.contract(address=contract_address, abi=abi)
tx_hash = input()
begin = datetime.now()
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
rich_logs = contract.events.UserRegistered().processReceipt(receipt)
print(rich_logs[0]['args'])
end = datetime.now()
print(end-begin)
import json
import subprocess
import pickle

from tqdm import tqdm

with open('testing/startingBalances.json', 'r') as f:
    data = json.load(f)

address_balances = {}

for entry in tqdm(data):
    address = entry['address']

    command = f'sudo ./bin/run endpoint:invoke token_getBalances \'{{"address": "{address}"}}\''
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    
    if result.returncode == 0:
        output = json.loads(result.stdout)
        balance = output['balances'][0]['availableBalance']
        address_balances[address] = balance
    else:
        print(f"Error invoking command for address {address}: {result.stderr}")

with open('testing/new_address_balances.pkl', 'wb') as f:
    pickle.dump(address_balances, f)

print("Balances have been saved to address_balances.pkl")

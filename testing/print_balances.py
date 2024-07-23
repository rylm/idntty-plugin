import pickle

with open('testing/address_balances.pkl', 'rb') as file:
    address_balances = pickle.load(file)

for address, balance in address_balances.items():
    print(f"{address}: {balance}")

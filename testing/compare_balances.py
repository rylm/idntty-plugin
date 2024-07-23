import pickle

def load_pickle(file_path):
    with open(file_path, 'rb') as file:
        return pickle.load(file)

old_balances = load_pickle('testing/address_balances.pkl')
new_balances = load_pickle('testing/new_address_balances.pkl')

for address in old_balances:
    old_balance = int(old_balances[address])
    new_balance = int(new_balances.get(address, 0))
    change = new_balance - old_balance
    change_sign = "+" if change >= 0 else "-"
    print(f"{address}: {old_balance} -> {new_balance} (change {change_sign}{abs(change)})")

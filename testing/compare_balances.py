#!/usr/bin/env python3
import pickle

OLD_PICKLE = "testing/address_balances.pkl"
NEW_PICKLE = "testing/new_address_balances.pkl"


def load_pickle(fp):
    with open(fp, "rb") as f:
        return pickle.load(f)


def main():
    old_balances = load_pickle(OLD_PICKLE)
    new_balances = load_pickle(NEW_PICKLE)

    for address in old_balances:
        old_balance = int(old_balances[address])
        new_balance = int(new_balances.get(address, "0"))
        diff = new_balance - old_balance
        sign = "+" if diff >= 0 else "-"
        print(f"{address}: {old_balance} -> {new_balance} (change {sign}{abs(diff)})")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
import pickle

INPUT_PICKLE = "testing/address_balances.pkl"


def main():
    with open(INPUT_PICKLE, "rb") as file:
        address_balances = pickle.load(file)

    # Just print them
    for address, balance in address_balances.items():
        print(f"{address}: {balance}")


if __name__ == "__main__":
    main()

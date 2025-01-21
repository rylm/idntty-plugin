#!/usr/bin/env python3
import json
import subprocess
import pickle
from tqdm import tqdm

# This script reads a JSON file with addresses and queries each address's
# token balances from the Klayr node. It then saves them as a .pkl file.

INPUT_FILE = "testing/startingBalances.json"
OUTPUT_PICKLE = "testing/new_address_balances.pkl"


def main():
    # 1. Load the addresses from a JSON file
    with open(INPUT_FILE, "r") as f:
        data = json.load(f)

    address_balances = {}

    for entry in tqdm(data, desc="Querying Balances"):
        address = entry["address"]
        # For each address, we call `token_getBalances`
        # which returns something like `{"balances":[ { "availableBalance":"xxx", ...}, ... ]}`
        cmd = (
            f"sudo ./bin/run endpoint:invoke token_getBalances "
            f"'{{\"address\":\"{address}\"}}'"
        )
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            try:
                output = json.loads(result.stdout)
                # The output is typically something like:
                # {"balances":[{"availableBalance":"100000000","lockedBalances":[],"tokenID":"0400000000000000"}]}
                if not output.get("balances"):
                    balance_str = "0"
                else:
                    # We'll just sum all availableBalance for demonstration, or just pick the first token.
                    # For simplicity, let's pick the first token:
                    balance_str = output["balances"][0]["availableBalance"]

                address_balances[address] = balance_str
            except json.JSONDecodeError:
                print(
                    f"Error parsing JSON for address={address}: {result.stdout}")
        else:
            print(
                f"[ERROR] Command for {address} failed: {result.stderr.strip()}")

    # 2. Save to pickle
    with open(OUTPUT_PICKLE, "wb") as pf:
        pickle.dump(address_balances, pf)

    print(f"[DONE] Balances have been saved to {OUTPUT_PICKLE}")


if __name__ == "__main__":
    main()

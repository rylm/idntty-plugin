#!/usr/bin/env python3
import subprocess
import json
from time import sleep

NUM_TX = 10          # How many transactions to send in total
BASE_FEE = 250000    # Fee in Beddows (adjust as needed)
SLEEP_BETWEEN = 5    # Seconds between sending transactions

# Passphrase for all validators (example)
PASSPHRASE = "glow region leisure soap parade index wedding all remember pretty mirror soap rapid roast cool among alter lemon group kick proof swing witness suffer"


def main():
    for i in range(NUM_TX):
        # We'll generate a unique label/value pair for each transaction
        label_str = f"test_label_{i}"
        value_str = f"test_value_{i}"

        # Build the dynamic params JSON
        # e.g. params='{"features": [{"label": "test_label_3", "value": "test_value_3"}]}'
        features_obj = {
            "features": [
                {
                    "label": label_str,
                    "value": value_str
                }
            ]
        }
        # Convert to JSON string
        param_str = json.dumps(features_obj)

        # Build the create command
        create_cmd = (
            f"./bin/run transaction:create identity setFeature {BASE_FEE} "
            f"--params='{param_str}' "
            f"--passphrase='{PASSPHRASE}'"
        )

        # 1. Create the transaction
        result = subprocess.run(create_cmd, shell=True,
                                capture_output=True, text=True)
        if result.returncode != 0:
            print(f"[ERROR] creating tx #{i+1}: {result.stderr.strip()}")
            continue

        # 2. Parse the JSON output
        try:
            parsed = json.loads(result.stdout)
        except json.JSONDecodeError:
            print(
                f"[ERROR] tx #{i+1} creation returned non-JSON: {result.stdout}")
            continue

        tx_hex = parsed.get("transaction")
        if not tx_hex:
            print(
                f"[ERROR] tx #{i+1} creation JSON missing 'transaction': {result.stdout}")
            continue

        # 3. Send it
        send_cmd = f"sudo ./bin/run transaction:send {tx_hex}"
        send_res = subprocess.run(
            send_cmd, shell=True, capture_output=True, text=True)
        if send_res.returncode != 0:
            print(f"[ERROR] sending tx #{i+1}: {send_res.stderr.strip()}")
        else:
            print(f"[OK] transaction #{i+1} sent. Hash={tx_hex}")

        # Sleep between each transaction to avoid spamming the node
        sleep(SLEEP_BETWEEN)

    print(f"Finished sending {NUM_TX} transactions.")


if __name__ == "__main__":
    main()

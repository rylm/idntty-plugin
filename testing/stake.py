#!/usr/bin/env python3
import subprocess
import json
from time import sleep

NUM_TX = 1
SLEEP_BETWEEN = 1

# Example stake command, adjust addresses, amounts, etc.
create_cmd = (
    "./bin/run transaction:create pos stake 100000000 "
    "--params='{\"stakes\":[{\"validatorAddress\":\"klyuxekgtbs47jqy8oo3dg6pe7rtw7u8u3e9bgpqx\",\"amount\":5000000000}]}' "
    "--passphrase='glow region leisure soap parade index wedding all remember pretty mirror soap rapid roast cool among alter lemon group kick proof swing witness suffer' "
    "--json"
)


def main():
    for i in range(NUM_TX):
        # 1. Create the transaction
        result = subprocess.run(create_cmd, shell=True,
                                capture_output=True, text=True)
        if result.returncode != 0:
            print(f"[ERROR] creating tx #{i+1}: {result.stderr.strip()}")
            continue

        # 2. Because transaction:create might output multiple lines, parse them carefully:
        lines = result.stdout.strip().splitlines()
        parsed = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
            try:
                parsed_line = json.loads(line)
                parsed = parsed_line
                # If it succeeded, stop searching
                break
            except json.JSONDecodeError:
                pass

        if not parsed:
            print(
                f"[ERROR] transaction #{i+1}: Could not find valid JSON in output:\n{result.stdout}")
            continue

        # 3. Extract the transaction hex
        tx_hex = parsed.get("transaction")
        if not tx_hex:
            print(
                f"[ERROR] transaction #{i+1} creation JSON missing 'transaction': {parsed}")
            continue

        # 4. Send it
        send_cmd = f"sudo ./bin/run transaction:send {tx_hex}"
        send_res = subprocess.run(
            send_cmd, shell=True, capture_output=True, text=True)
        if send_res.returncode != 0:
            print(f"[ERROR] sending tx #{i+1}: {send_res.stderr.strip()}")
        else:
            print(f"[OK] transaction #{i+1} sent. Hash={tx_hex}")
            print("Send output:\n", send_res.stdout.strip())

        sleep(SLEEP_BETWEEN)

    print(f"Finished sending {NUM_TX} transactions.")


if __name__ == "__main__":
    main()

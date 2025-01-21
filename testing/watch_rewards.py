#!/usr/bin/env python3
import subprocess
import json
import time

RPC_URL = "http://localhost:7887/rpc"


def rpc_call(method, params):
    """
    Helper to run a curl command for JSON-RPC. Returns Python dict or None.
    """
    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": method,
        "params": params
    }
    cmd = f"curl --silent -X POST {RPC_URL} -H 'Content-Type: application/json' -d '{json.dumps(payload)}'"
    proc = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if proc.returncode != 0:
        print(f"[ERROR] RPC call failed: {proc.stderr.strip()}")
        return None
    try:
        resp = json.loads(proc.stdout)
        return resp
    except json.JSONDecodeError:
        print(f"[ERROR] Could not parse JSON: {proc.stdout}")
        return None


def get_node_info():
    res = rpc_call("system_getNodeInfo", {})
    if not res or "result" not in res:
        return None
    return res["result"]


def get_block_by_height(h):
    res = rpc_call("chain_getBlockByHeight", {"height": h})
    if not res or "result" not in res:
        return None
    return res["result"]


def get_events_at_height(h):
    res = rpc_call("chain_getEvents", {"height": h})
    if not res or "result" not in res:
        return []
    return res["result"]


def main():
    last_height = 0

    while True:
        info = get_node_info()
        if not info:
            print("[WARN] Could not fetch node info, sleeping...")
            time.sleep(3)
            continue

        current_height = info.get("height", 0)
        if current_height <= last_height:
            time.sleep(2)
            continue

        for h in range(last_height + 1, current_height + 1):
            block_data = get_block_by_height(h)
            if not block_data:
                print(f"[ERROR] Could not fetch block {h}")
                continue

            header = block_data["header"]
            generator = header.get("generatorAddress")
            print(f"[BLOCK {h}] forged by: {generator}")

            # Check if there's a 'rewardMinted' event
            events = get_events_at_height(h)
            for ev in events:
                if ev.get("module") == "dynamicReward" and ev.get("name") == "rewardMinted":
                    # The 'data' is proto-encoded.
                    # We can at least show that the event occurred:
                    print(f"    -> rewardMinted event! data={ev['data']}")

        last_height = current_height
        time.sleep(2)


if __name__ == "__main__":
    main()

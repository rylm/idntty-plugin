import json

KLAYR32_CHARSET = 'zxvcpmbn3465o978uyrtkqew2adsjhfg'
DEFAULT_KLAYR32_ADDRESS_PREFIX = 'kly'


def convert_uint_array(uint_array: list[int], from_bits: int, to_bits: int) -> list[int]:
    max_value = (1 << to_bits) - 1
    accumulator = 0
    bits = 0
    result = []

    for byte in uint_array:
        if byte < 0 or (byte >> from_bits) != 0:
            return []

        accumulator = (accumulator << from_bits) | byte
        bits += from_bits

        while bits >= to_bits:
            bits -= to_bits
            result.append((accumulator >> bits) & max_value)

    return result


def get_address_from_klayr32(base32_addr: str, prefix: str = DEFAULT_KLAYR32_ADDRESS_PREFIX) -> bytes:
    base32_clean = base32_addr[len(prefix):-6]
    integer_sequence = [KLAYR32_CHARSET.index(c) for c in base32_clean]
    integer_8bit = convert_uint_array(integer_sequence, 5, 8)
    return bytes(integer_8bit)[:20]


with open('config/default/dev-validators.json') as f:
    data = json.load(f)

user_substore = sorted(
    [
        {
            "address": key["address"],
            "tokenID": "0000000000000000",
            "availableBalance": "100000000000000",
            "lockedBalances": []
        }
        for key in data["keys"]
    ],
    key=lambda x: (
        get_address_from_klayr32(x["address"]),
        bytes.fromhex(x["tokenID"])
    )
)

validators = [{
    "address": key["address"],
    "name": f"genesis_{i}",
    "blsKey": key["plain"]["blsKey"],
    "proofOfPossession": key["plain"]["blsProofOfPossession"],
    "generatorKey": key["plain"]["generatorKey"],
    "lastGeneratedHeight": 0,
    "isBanned": False,
    "reportMisbehaviorHeights": [],
    "consecutiveMissedBlocks": 0,
    "commission": 0,
    "lastCommissionIncreaseHeight": 0,
    "sharingCoefficients": []
} for i, key in enumerate(data["keys"])]

init_validators = [key["address"] for key in data["keys"]][:51]

# print(json.dumps(user_substore))
# print(json.dumps(validators))
print(json.dumps(init_validators))
# print(len(user_substore))

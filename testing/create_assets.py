import json

with open('../config/default/dev-validators.json') as f:
    data = json.load(f)

userSubstore = [
    {
        "address": key["address"],
        "tokenID": "0000000000000000",
        "availableBalance": "100000000000000",
        "lockedBalances": []
    }
    for key in data["keys"]
]

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

initValidators = [key["address"] for key in data["keys"]]

# print(json.dumps(userSubstore))
# print(json.dumps(validators))
print(json.dumps(initValidators))
# print(len(userSubstore))

import subprocess
import json
from time import sleep

create_command = "sudo ./bin/run transaction:create identity setFeature 145000 --params='{\"features\": [{\"label\": \"test\", \"value\": \"test\"}]}' --passphrase='march unfold dizzy lyrics soap print notable brief address another begin evolve note open artist prison clerk twelve fetch course rather corn next cushion'"

for i in range(1):
    # Create the transaction
    result = subprocess.run(create_command, shell=True, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error creating transaction {i+1}: {result.stderr}")
        continue

    # Parse the transaction JSON
    transaction_json = json.loads(result.stdout)
    transaction_hash = transaction_json.get('transaction')
    
    if not transaction_hash:
        print(f"Transaction {i+1} creation returned unexpected format: {result.stdout}")
        continue

    # Send the transaction
    send_command = f"sudo ./bin/run transaction:send {transaction_hash}"
    send_result = subprocess.run(send_command, shell=True, capture_output=True, text=True)
    
    if send_result.returncode != 0:
        print(f"Error sending transaction {i+1}: {send_result.stderr}")
    else:
        print(f"Transaction {i+1} sent successfully")

    sleep(1)

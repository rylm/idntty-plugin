# How to run a Klayr node

## Prerequisites

-   Strictly Node.js v18.20.4

## Install dependencies

```bash
npm install
```

## Configure the node

1. Copy the `config.rpc.json` file to `config.json`:

```bash
cp config/default/config.rpc.json config/default/config.json
```

2. Set system.dataPath in `config.json` to a directory to store the node's data (make sure it is empty)

## Run the node

```bash
./bin/run start
```

## Dashboard

You can add the following to the `plugins` section of your `config.json` to enable the dashboard:

```json
"plugins": {
    "dashboard": {
        "applicationUrl": "ws://NODE_IP:7887/rpc-ws",
        "host": "0.0.0.0",
        "port": PORT
    }
}
```

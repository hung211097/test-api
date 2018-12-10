const { RpcClient } = require('tendermint')

const client = RpcClient('https://komodo.forest.network:443/websocket')

client.block({height: 285}).then((res) => console.log(res)).catch(e => console.log(e))

console.log(process.env.NODE_ENV);

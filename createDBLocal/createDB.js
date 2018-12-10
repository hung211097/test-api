const dbConfig = require('../setting').databaseConfig;
const Sequelize = require('sequelize');
const db = new Sequelize(dbConfig);
const { RpcClient } = require('tendermint')
const { encode, decode, verify, sign, hash } = require('../lib/transaction')

// db.authenticate().then(() => {
//   console.log('Success');
// }).catch(e => console.log(e))

// const Users = db.define('Accounts', {
//   userID: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
//   created_at: {type: Sequelize.DATE, allowNull: false, primaryKey: true, defaultValue: Sequelize.NOW},
//   username: {type: Sequelize.STRING, allowNull: false},
//   password: {type: Sequelize.STRING, allowNull: false},
// })
//
// db.sync().then(() => {console.log('Successfully')})
//
// Users.create({
//   userID: 1, username: 'yasuo', password: '123456'
// }).then(() => {
//   Users.create({
//     userID: 1, username: 'zed', password: '123456'
//   }).then(() => {
//     Users.create({
//       userID: 1, username: 'helo', password: '123456'
//     }).then(() => {console.log("Successfully")})
//   })
// })

// Users.bulkCreate([
//   {userID: 1, username: 'yasuo', password: '123456'},
//   {userID: 2, username: 'zed', password: '123456'},
//   {userID: 3, username: 'helo', password: '123456'},
// ]).then(() => {console.log("Successfully")})

// let db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.user = require('../models/user')(sequelize, Sequelize);
// module.exports = db;

const Users = db.define('Users', {
  public_key: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
  tendermint_address: {type: Sequelize.STRING, allowNull: true},
  username: {type: Sequelize.STRING, allowNull: false},
  sequence: {type: Sequelize.INTEGER, allowNull: false},
})

const Transactions = db.define('Transactions', {
  public_key: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
  public_key_received: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
  created_at: {type: Sequelize.DATE, allowNull: false, primaryKey: true, defaultValue: Sequelize.NOW},
  amount: {type: Sequelize.BIGINT, allowNull: false},
  operation: {type: Sequelize.STRING, allowNull: false}
})

const Info = db.define('Blockchains', {
  height: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
})

// db.sync();

// const client = RpcClient('https://komodo.forest.network:443/websocket')
// let fromBlock = 0;
// let toBlock;
// client.block().then((res) => {
//   // console.log(res)
//   toBlock = +res.block_meta.header.height
//   Info.create({height: toBlock}).then(() => {}).catch(e => {console.log("ERROR INSERT HEIGHT", e)})
//   let query = []
//   for(let i = 1; i <= toBlock; i++){
//     query.push(client.block({height: i}))
//   }
//
//   Promise.all(query).then((result) => {
//     result.forEach((item, index) => {
//       if(item.block.data.txs){
//           const buf = Buffer.from(item.block.data.txs[0], 'base64')
//           const deData = decode(buf)
//           Users.findOne({
//             where: {
//               public_key: deData.account,
//             }
//           }).then((acc) => {
//             console.log("ACCOUNT NEK");
//             if(acc){
//               console.log("UPDATE SUCCESSFULLY");
//               Users.update({
//                 sequence: deData.sequence
//               },
//               {
//                 where: {
//                    public_key: deData.account
//                  }
//               }).then(() => {}).catch(e => console.log("ERROR UPDATE", e))
//             }
//             switch(deData.operation)
//             {
//               case 'create_account':
//                 // console.log(deData.params.address);
//                 // console.log("User " + (index + 1));
//                 Users.create({
//                   public_key: deData.params.address,
//                   tendermint_address: '',
//                   username: "User " + (index + 1),
//                   sequence: 0
//                 }).then(() => {})
//                 break
//               case 'payment':
//                 Transactions.create({
//                   public_key: deData.account,
//                   public_key_received: deData.params.address,
//                   amount: deData.params.amount,
//                   operation: deData.operation
//                 }).catch(e => console.log("ERROE CREATE TRANSACTION", e))
//                 break
//               default:
//                 break
//             }
//           console.log(deData);
//         }).catch(e => console.log("ERROR FIND ACCOUNT", e))
//       }
//     })
//   }).catch(e => console.log("ERROR PROMISE", e))
// })

const client = RpcClient('https://komodo.forest.network:443/websocket')
let fromBlock = 0;
let toBlock;
client.block().then((res) => {
  // console.log(res)
  toBlock = +res.block_meta.header.height
  Info.create({height: toBlock}).then(() => {}).catch(e => {console.log("ERROR INSERT HEIGHT", e)})
  let query = []
  for(let i = 1; i <= toBlock; i++){
    query.push(client.block({height: i}))
  }

  Promise.all(query).then((result) => {
    result.forEach((item, index) => {
      if(item.block.data.txs){
          const buf = Buffer.from(item.block.data.txs[0], 'base64')
          const deData = decode(buf)
          Users.update({
            sequence: deData.sequence
          },
          {
            where: {
               public_key: deData.account
             }
          }).then(() => {
            switch(deData.operation)
            {
              case 'create_account':
                // console.log(deData.params.address);
                // console.log("User " + (index + 1));
                Users.create({
                  public_key: deData.params.address,
                  tendermint_address: '',
                  username: "User " + (index + 1),
                  sequence: 0
                }).then(() => {})
                break
              case 'payment':
                Transactions.create({
                  public_key: deData.account,
                  public_key_received: deData.params.address,
                  amount: deData.params.amount,
                  operation: deData.operation
                }).catch(e => console.log("ERROE CREATE TRANSACTION", e))
                break
              default:
                break
            }
          }).catch(e => console.log("ERROR UPDATE", e))
        console.log(deData);
      }
    })
  }).catch(e => console.log("ERROR PROMISE", e))
})

//
// Users.findOne({
//   where: {
//     public_key: "GAO4J5RXQHUVVONBDQZSRTBC42E3EIK66WZA5ZSGKMFCS6UNYMZSIDBI",
//   }
// }).then((acc) => {
//   console.log(acc);
//   if(acc){
//     Users.update({
//       sequence: 66
//     },
//     {
//       where: {
//          public_key: "GAO4J5RXQHUVVONBDQZSRTBC42E3EIK66WZA5ZSGKMFCS6UNYMZSIDBI"
//        }
//     }).catch(e => console.log("ERROR UPDATE", e))
//   }
// })

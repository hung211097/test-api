// const setting = {
//     databaseConfig: {
//         uri: 'postgres://iifhpxkmqnbpaj:48ee3d919d9db142d338858177f0ababd5abdbaaddd239f155d0a47ba38da1d8@ec2-54-225-196-122.compute-1.amazonaws.com:5432/dfj5sv7225f40q',
//         database: 'dfj5sv7225f40q',
//         username: 'iifhpxkmqnbpaj',
//         password: '48ee3d919d9db142d338858177f0ababd5abdbaaddd239f155d0a47ba38da1d8',
//         host: 'ec2-54-225-196-122.compute-1.amazonaws.com',
//         port: 5432,
//         dialect: 'postgres',
//         operatorsAliases: false,
//         protocol: 'postgres',
//         dialectOptions: {
//             ssl: true
//         },
//         // pool: {
//         //     max: 5,
//         //     min: 0,
//         //     acquire: 30000,
//         //     idle: 10000
//         // }
//     }
// }

const setting = {
  databaseConfig: {
    database: 'demoDB',
    username: 'postgres',
    password: 'thelight136497',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    operatorsAliases: false,
    protocol: 'postgres',
    // dialectOptions: {
    //     ssl: true
    // },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}

module.exports = setting;

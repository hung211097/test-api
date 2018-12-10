const transaction = require('./transaction')
const { Keypair } = require('stellar-base');
const crypto = require('crypto');
const v1 = require('./transaction/v1');

// const private = "SB5YAIOBU72LC4PTYTEUJOKCN4LWEQDPKKFRQ6NRQMXRG42TMURPRZNA"
// const public_me = "GBIDPG4BFSTJSR3TYPJG4S4R2MEZX6U6FK5YJVIGD4ZJ3LTM4B5IS4RB"
// const public_you = "GBYQQOZQWIDOB2Y27EQKESSFODV63W3A5YGYISG4KIKS5ZI6QOVZLDCY"

// const tx = {
//   version: 1,
//   sequence: 1,
//   memo: Buffer.alloc(0),
//   account: public_me,
//   operation: "payment",
//   params: {
//     address: public_you,
//     amount: 100
//   },
//   signature: new Buffer(64)
// }

// const tx = {
//   version: 1,
//   sequence: 2,
//   memo: Buffer.alloc(0),
//   account: public_me,
//   operation: "create_account",
//   params: {
//     address: "GDB6P3NEIPXYUXTLOO7MCYMKBV4LESHH7KCPGJDYDG7AFLTD7QOUIGRJ",
//   },
//   signature: new Buffer(64)
// }
//
// transaction.sign(tx, private);
// let TxEncode = transaction.encode(tx).toString('hex');
// console.log(TxEncode);

function getUnsignedHash(tx) {
  return crypto
    .createHash('sha256')
    .update(encode({
      ...tx,
      signature: Buffer.alloc(64, 0),
    }))
    .digest();
}

function encode(tx) {
  switch (tx.version) {
    case 1:
      return v1.encode(tx);

    default:
      throw Error('Unsupport version');
  };
}


function verifyKey(private, public){
  const dummy = {
    version: 1,
    sequence: 1,
    memo: Buffer.alloc(0),
    account: public,
    operation: "create_account",
    params: {
      address: public,
    },
    signature: new Buffer(64)
  }

  transaction.sign(dummy, private);
  const key = Keypair.fromSecret(private);

  console.log(key.publicKey());
  // return key.verify(getUnsignedHash(dummy), dummy.signature);
}

const private = "SB5YAIOBU72LC4PTYTEUJOKCN4LWEQDPKKFRQ6NRQMXRG42TMURPRZNA"
const public = "GBIDPG4BFSTJSR3TYPJG4S4R2MEZX6U6FK5YJVIGD4ZJ3LTM4B5IS4RB"
console.log(verifyKey(private, public));

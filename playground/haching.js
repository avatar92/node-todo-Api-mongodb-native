const {SHA256}=require('crypto-js'); 
const jwt=require('jsonwebtoken')


var data={
  id:10
}

var token=jwt.sign(data,'123abc')
console.log(token)

var decoded=jwt.verify(token,'123abc')
console.log('decoded:',decoded)

// var message='I am user number 3'

// var hach=SHA256(message).toString();

// console.log(`message : ${message}`);

// console.log(`hach : ${hach}`);

// var data={
//   id:4
// };

// var token={
//   data,
//   hash:SHA256(JSON.stringify(data)+'somesecret').toString()
// }

// // token.data.id=5;
// // token.hash=SHA256(JSON.stringify(token.data)).toString()

// var resultHash=SHA256(JSON.stringify(token.data)+ 'somesecret').toString();

// if(resultHash===token.hash){
//   console.log('data is not changed')
// }else{
//   console.log('data is changed dont trust')
// }
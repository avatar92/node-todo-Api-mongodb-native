// const MongoClient = require('mongodb').MongoClient; 
const {MongoClient,ObjectID} = require('mongodb'); 

var obj=new ObjectID();
console.log(obj)
const url='mongodb://localhost:27017/TodoApp';


MongoClient.connect(url,{useUnifiedTopology: true},(err,client)=>{
  if(err){
    console.log('Unable to connect to mongoDB server')
  }
  console.log('connected to mongoDb server')
  const db=client.db('TodoApp')
  // db.collection('Todos').insertOne({
  //   text:'something to do',
  //   completed:'false'
  // },(err,result)=>{
  //   if(err){
  //     return console.log('unable to insert todo',err)
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2))
  // });
  // db.collection('Users').insertOne({
  //   name:'adel',
  //   age:27,
  //   location:"bennane"
  // },(err,results)=>{
  //   if(err){
  //     return console.log('unable to insert User',err)
  //   }
  //   console.log(JSON.stringify(results.ops[0]._id.getTimestamp(),undefined,2))
  // });
  client.close();
});
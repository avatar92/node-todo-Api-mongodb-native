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
  // db.collection('Todos').deleteMany({text:'eat lunch'}).then((result)=>{
  //   console.log(result)
  // })
  // db.collection('Todos').deleteOne({text:'eat lunch'}).then((result)=>{
  //   console.log(result)
  // })
  // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
  //   console.log(result)
  // })
  // db.collection('Users').deleteOne({name:'adel'}).then((result)=>{
  //   console.log(result.result)
  // })
  // db.collection('Users').deleteMany({name:'adel'}).then((results)=>{
  //   console.log(results.result)
  // })
  db.collection('Users').findOneAndDelete({_id:new ObjectID('5ded05958b5abb3b90bcc2bc')}).then((results)=>{
    console.log(results)
  })
  // client.close();
});
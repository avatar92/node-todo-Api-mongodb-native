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
  // db.collection('Todos').findOneAndUpdate(
  //   {
  //     _id:new ObjectID('5ded453a3036df77f43ad521')
  //   },
  //   {
  //     $set :
  //     {
  //       completed:true
  //     }
  //   },
  //   {
  //     returnOriginal:false
  //   }).then((result)=>{
  //     console.log(result)
  //   })
  db.collection('Users').findOneAndUpdate(
    {
      _id:new ObjectID('5ded027fc990af1694314f37')
    },
    {
      $set:{
        name:"adel"
      },
      $inc:{
        age:1
      }
    },
    {
      returnOriginal:false
    }
  ).then((result)=>{
    console.log(result)
  })
  // client.close();
});
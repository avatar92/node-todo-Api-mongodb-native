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
  // db.collection('Todos').find({_id:new ObjectID('5ded014299029a229c88ab9b')}).toArray().then((docs)=>{
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,2))
  // },err=>{
  //   console.log('unable to fetch todos',err)
  // });
  // db.collection('Todos').find().count().then((count)=>{
  //   console.log(`Todos count: ${count}`);
  // },err=>{
  //   console.log('unable to fetch todos',err)
  // });
  db.collection('Users').find({name:"adel"}).toArray().then((docs)=>{
    console.log(`Users: 
    ${JSON.stringify(docs,undefined,2)}`
    );
  },err=>{
    console.log('unable to fetch todos',err)
  });
  // client.close();
});
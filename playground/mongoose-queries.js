const {ObjectID}=require('mongodb')

const {mongoose}=require('./../server/db/mongoose.js');
const {Todo}=require('./../server/models/todo.js');

// var id="dee9c163e3cd79445e64646";

// if(!ObjectID.isValid(id)){
//   console.log('id not valid')
// }

// Todo.find({
//   _id:id
// }).then((todos)=>{
//   console.log('Todos',todos)
// })

// Todo.findOne({
//   _id:id
// }).then((todo)=>{
//   console.log('Todo',todo)
// })

// Todo.findById(id).then((todobyid)=>{
//   if(!todobyid){
//     return console.log('Todo by ID not found')
//   }
//   console.log('Todo by id',todobyid)
// }).catch((e)=>{
//   console.log(e)
// })
const {User}=require('./../server/models/user');

var id='5dee488f07e37f44642248a5';

User.find({_id:id}).then((users)=>{
  console.log(users)
})
User.findOne({_id:id}).then(user=>{
  console.log(user)
})
User.findById(id).then((user)=>{
  if(!user){
    return console.log('Unable to find the user')
  }
  console.log('User found: ',user)
}).catch((e)=>{console.log(e)})
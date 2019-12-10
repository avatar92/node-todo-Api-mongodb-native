const {ObjectID}=require('mongodb')

const {mongoose}=require('./../server/db/mongoose.js');
const {Todo}=require('./../server/models/todo.js');

// Todo.remove({}).then((result)=>{
//   console.log(result)
// })


Todo.findByIdAndRemove("5defb4af2d7971f424dcba35").then((todo)=>{
  console.log(todo)
})
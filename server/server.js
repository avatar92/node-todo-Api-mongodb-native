/*third module import */
const express=require('express');
const bodyParser=require('body-parser');

/*local import*/
var {mongoose}=require('./db/mongoose.js');
var {Todo}=require('./models/todo.js');
var {User}=require('./models/user.js');

var app=express();
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var todo=new Todo({
    text:req.body.text
  })
  todo.save().then((doc)=>{
    console.log(`${todo.text} ..... is saved`);
    res.send(doc);
  },e=>{
    res.send(e)
  })
});

app.listen(3001,()=>{
  console.log(`stated on the port ${3001}`)
})


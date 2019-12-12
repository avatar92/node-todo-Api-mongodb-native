require('./config/config.js')


/*third module import */
const express = require('express');
const bodyParser = require('body-parser');
const _=require('lodash')
const {ObjectID}=require('mongodb')
const bcrypt=require('bcryptjs')

/*Local module */
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate}=require('./middleware/authenticate.js')

var app = express();
const port = process.env.PORT


app.use(bodyParser.json());


app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos})
  });
},e=>{
  res.status(400).send(e)
});

app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send()
    }
    res.send({todo});
  }).catch((e)=>{res.status(400).send(e)})
})

app.delete('/todos/:id',(req,res)=>{
  var id=req.params.id; 
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo})
  }).catch((e)=>res.status(400).send(e))
});

app.patch('/todos/:id',(req,res)=>{
  var id=req.params.id; 
  var body=_.pick(req.body,['text','completed']);
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt=new Date().getTime();
  }else{
    body.completed=false; 
    body.completedAt=null;
  }
  Todo.findByIdAndUpdate(id,{
    $set:body
  },{
    new:true
  }).then((todo)=>{
    if(!todo){
      res.status(404).send()
    }
    res.status(200).send({todo})
  }).catch((e)=>res.status(400).send())
});

/*users */

app.post('/users',(req,res)=>{
  var body=_.pick(req.body,['email','password']);
  var user=new User({
    email:body.email,
    password:body.password
  });
  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user)
  }).catch((e)=>res.status(400).send(e))

})


app.get('/users/me',authenticate,(req,res)=>{
  res.send(req.user)
})

app.post('/users/login',(req,res)=>{
  var body=_.pick(req.body,['email','password']);

  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user)
    });
  }).catch((e)=>{
    res.sendStatus(400).send()
  })

  // User.findOne({email:req.body.email}).then((user)=>{
  //   if(!user){
  //     return res.sendStatus(404).send()
  //   }else{
  //     bcrypt.compare(req.body.password,user.password,(err,result)=>{
  //       if(result===false){
  //         return res.sendStatus(401).send();
  //       }
  //     })
  //     res.sendStatus(200).send(user);
  //   }

  // }).catch((e)=>res.send(400).send())

});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

module.exports = {app};

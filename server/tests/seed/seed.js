const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken')

const {Todo}=require('./../../models/todo.js')
const {User}=require('./../../models/user.js')

const userOneId=new ObjectID()
const userTwoId=new ObjectID()

const users=[{
  _id:userOneId,
  email:'adel@gmail.com',
  password:'adel123',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
  }]
  },
  {
    _id:userTwoId,
  email:'amine@gmail.com',
  password:'amine123',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET).toString()
  }]
  }
]

const todos=[{
  text:'first todo',
  _id:new ObjectID(),
  _creator:userOneId
  },
  {
  text:'second todo',
  _id:new ObjectID(),
  completed:true,
  completedAt:333  ,
  _creator:userTwoId
  }
];

const populatesTodos=done=>{
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(()=>done())
};

const populatesUsers=done=>{
  User.remove({}).then(()=>{
    var userOne=new User(users[0]).save();
    var userTwo=new User(users[1]).save();
    
    return Promise.all([userOne,userTwo])
  }).then(()=>done())
};

module.exports={
  todos,
  populatesTodos,
  users,
  populatesUsers 
}
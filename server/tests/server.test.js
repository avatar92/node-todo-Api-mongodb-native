const _=require('lodash')
const expect = require('expect');
const request = require('supertest');
const {ObjectID}=require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User}=require('./../models/user.js')
const {todos,populatesTodos,users,populatesUsers}=require('./seed/seed.js')


beforeEach(populatesUsers);
beforeEach(populatesTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    var token=users[0].tokens[0].token;
    request(app)
      .post('/todos')
      .set('x-auth',token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
  it('should not create todos with invalid body data',(done)=>{
    var token=users[0].tokens[0].token;
    request(app)
      .post('/todos')
      .set('x-auth',token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
  
});

describe('Get /todos',()=>{
  it('should get all todos of a specifique user',done=>{
    var token=users[0].tokens[0].token;
    request(app)
      .get('/todos')
      .set('x-auth',token)
      .expect(200)
      .expect((res)=>{
        // console.log(res.body)
        expect(res.body.todos.length).toBe(1)
      })
      .end(done);
  })
})
describe('GET /todos/:id',()=>{
  it('should return Todo doc by id',done=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        // console.log(res.body.todo.text)
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  });
  it('should not return Todo doc created by other user',done=>{
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });
  it('should return 404 if Todo not be found',done=>{
    var _id=new ObjectID().toHexString();
    request(app)
      .get(`/todos/${_id}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });
  it('should return 404 if ID is not valid',done=>{
    request(app)
      .get(`/todos/${'123abc'}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });
})
describe('DELETE /todos/:id',()=>{
  it('should remove a todo',done=>{
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(todos[1]._id.toHexString())
      })
      .end(done)
  });
  it('should not remove a todo for other user',done=>{
    var hexId=todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end((err,res)=>{
        if(err){
          return done(err)
        }
        Todo.findById(hexId).then((todo)=>{
          expect(todo).toBeTruthy();
          done();
        }).catch(e=>done(e))
      })
  });
  it('should return 404 if ID is not found in the Data Base',done=>{
    var id=new ObjectID().toHexString()
    request(app)  
      .get(`/todos/${id}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done)
  });
  it('shoyld return 404 if ID is not valid',done=>{
    request(app)
      .get('/todos/1234abcd')
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done)
  })
});

describe('PATCH todos/:id',()=>{
  it('should PATCH the todo',(done)=>{
    var id=todos[0]._id.toHexString();
    var text='this should be our new text'
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        // console.log(res.body.todo.completedAt)
        // expect(res.body.todo.completedAt).toBeA('number');
        expect(typeof res.body.todo.completedAt).toBe('number')
      })
      .end(done)
  });

  it('should not PATCH the todo of an other user',(done)=>{
    var id=todos[0]._id.toHexString();
    var text='this should be our new text'
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed:true,
        text
      })
      .expect(404)
      .end(done)
  });

  it('should clear completedAt when todo is not completed',done=>{
    var id=todos[1]._id.toHexString();
    var text='this should be our new text!!'
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed:false,
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        // console.log(res.body.todo.completedAt)
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done)
  })

});
describe('GET users/me',()=>{
  it('should return user if authenticated',done=>{
    request(app)  
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  });
  it('it should return 401 if user not authenticated',(done)=>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({})
      })
      .end(done)
  });
})

describe('POST /users',()=>{
  it('should create a user',(done)=>{
    var email='email@gmail.com';
    var password='password';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err){
          return done(err)
        }
        User.findOne({email}).then((user)=>{
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done()
        }).catch(e=>done(e))
      })
  });
  it('should return a validation error if request is not valid',done=>{
    var userOne={
      email:'adel',
      password:'abc123'
    };
    var userTwo={
      email:'adel@gmail.com',
      password:'ab3'
    };
    request(app)
      .post('/users')
      .send(userTwo)
      .expect(400)
      .end(done)
  });
  it('should not create a user if email in use',done=>{
    var userInsideDataBase={
      email:'adel@gmail.com',
      password:'123adcj'
    };
    request(app)
      .post('/users')
      .send(userInsideDataBase)
      .expect(400)
      .end(done)
  });
});

describe('POST /users/login',()=>{
  it('should login user and auth token',(done)=>{
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err,res)=>{
        if(err){
          return (done)
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.toObject().tokens[1]).toMatchObject({
            access:'auth',
            token:res.headers['x-auth']
          });
          done();
        }).catch((e)=>done(e))
      })
  });
  it('should reject invalid login',(done)=>{
    var password='acsdfgooo';
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password
      })
      .expect(400)
      .expect((res)=>{
        // console.log(res)
        expect(res.headers['x-auth']).toBeFalsy()
      })
      .end((err,res)=>{
        if(err){
          return (done)
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(1)
          done();
        }).catch((e)=>done(e))
      })
  })
});

describe('DELETE /users/me/token',()=>{
  it('should remove auth token on Logout',(done)=>{
    request(app)
      .delete('/users/me/token')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .end((err,res)=>{
        if(err){
          return err
        }
        User.findById(users[0]._id).then((user)=>{
          // console.log(users[0].tokens)
          expect(user.tokens.length).toBe(0);
          done();
        }).catch(e=>done(e))
      })
  });
});
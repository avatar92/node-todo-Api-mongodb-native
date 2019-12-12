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

    request(app)
      .post('/todos')
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
    request(app)
      .post('/todos')
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
  it('should get all todos',done=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        // console.log(res.body)
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  })
})
describe('GET /todos/:id',()=>{
  it('should return Todo doc by id',done=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        // console.log(res.body.todo.text)
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  });
  it('should return 404 if Todo not be found',done=>{
    var _id=new ObjectID().toHexString();
    request(app)
      .get(`/todos/${_id}`)
      .expect(404)
      .end(done)
  });
  it('should return 404 if ID is not valid',done=>{
    request(app)
      .get(`/todos/${'123abc'}`)
      .expect(404)
      .end(done)
  });
})
describe('DELETE /todos/:id',()=>{
  it('should remove a todo',done=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  });
  it('should return 404 if ID is not found in the Data Base',done=>{
    var id=new ObjectID().toHexString()
    request(app)  
      .get(`/todos/${id}`)
      .expect(404)
      .end(done)
  });
  it('shoyld return 404 if ID is not valid',done=>{
    request(app)
      .get('/todos/1234abcd')
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
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        // console.log(res.body.todo.completedAt)
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done)
  });
  
  it('should clear completedAt when todo is not completed',done=>{
    var id=todos[1]._id.toHexString();
    var text='this should be our new text!!'
    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed:false,
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        // console.log(res.body.todo.completedAt)
        expect(res.body.todo.completedAt).toNotExist();
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
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err){
          return done(err)
        }
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done()
        })
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
})
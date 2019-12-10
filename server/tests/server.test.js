const _=require('lodash')
const expect = require('expect');
const request = require('supertest');
const {ObjectID}=require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos=[{
  text:'first todo',
  _id:new ObjectID()
  },
  {
  text:'second todo',
  _id:new ObjectID(),
  completed:true,
  completedAt:333  
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(()=>done())
});

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

})
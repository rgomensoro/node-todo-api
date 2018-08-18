const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require ('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

var todos = [{
    _id: new ObjectID(),
    text: "my first test Todo"
},{
    _id: new ObjectID(),
    text: "my second test Todo"
}];


beforeEach((done) => {
    Todo.remove({}).then (() => {
        return Todo.insertMany(todos);
    }).then(()=> done());

});

describe('POST /todos', () => {

    it('Should create a new Todo.', (done) =>{

        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(201)
            .expect((res) =>{
                expect(res.body.text).toBe(text);
            })

            .end ((err,res) =>{
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

    it('Should not create a Todo with invalid body data.', (done) =>{

        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end ((err,res) =>{
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
describe('GET /todos', () => {

    it('Should get all todos.', (done) =>{

        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) =>{
            expect (res.body.todos.length).toBe(2);
        })
        .end (done);
    });
});

describe('GET /todos:id', () => {

    it('Should get a valid todo.', (done) =>{

        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) =>{
            expect (res.body.todo.text).toBe(todos[0].text);
        })
        .end (done);
    });

    it('Should get a invalid Object error (400).', (done) =>{

        request(app)
            .get('/todos/123abc}')
        .expect(400)
        .end (done);
    });

    it('Should not get a todo (404)', (done) =>{

        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end (done);
    });


});

describe('DELETE /todos:id', () => {

    it('Should delete a valid todo.', (done) =>{

        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) =>{
            expect (res.body.todo.text).toBe(todos[0].text);
        })
        .end (done);
    });

    it('Should delete a invalid Object error (400).', (done) =>{

        request(app)
            .delete('/todos/123abc}')
        .expect(400)
        .end (done);
    });

    it('Should not delete a todo (404)', (done) =>{

        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end (done);
    });


});

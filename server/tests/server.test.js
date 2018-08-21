const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require ('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos} = require('./seed/seed');
const {users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

        var hexID = todos[0]._id.toHexString();

        request(app)
        .get(`/todos/${hexID}`)
        .expect(200)
        .expect((res) =>{
            expect (res.body.todo._id).toBe(hexID);
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

        var hexID = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) =>{
                expect (res.body.todo.text).toBe(todos[0].text);
        })
        .end ((err,res) =>{
            if (err) {
                return done(err);
            }

        Todo.findById(hexID).then((todo) => {
            expect(todo).toBeNull();
            done();
        }).catch((e) => done(e));
    });
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

describe('PATCH /todos:id', () => {

    it('Should update a valid todo.', (done) =>{

        var hexID = todos[0]._id.toHexString();
        var todo = {
            text: "Updated todo",
            completed: true
        }

        request(app)
            .patch(`/todos/${hexID}`)
            .send(todo)
            .expect(200)
            .expect((res) =>{
                expect (res.body.todo.text).toBe(todo.text);
                expect (res.body.todo.completed).toBeTruthy();
                expect (res.body.todo.completedAt).toBeTruthy();
       })
        .end ((err,res) =>{
            if (err) {
                return done(err);
            }

        Todo.findById(hexID).then((todo) => {
            expect(todo).toBeDefined();
            done();
        }).catch((e) => done(e));
    });
});

    it('Should clear completedAt when set completed FALSE.', (done) =>{
 
        var hexID = todos[1]._id.toHexString();
        var todo = {
            text: "Updated todo second",
            completed: false
        }

        request(app)
            .patch(`/todos/${hexID}`)
            .send(todo)
            .expect(200)
            .expect((res) =>{
                expect (res.body.todo.text).toBe(todo.text);
                expect (res.body.todo.completed).toBeFalsy();
                expect (res.body.todo.completedAt).toBeFalsy();
        })
        .end ((err,res) =>{
            if (err) {
                return done(err);
            }

        Todo.findById(hexID).then((todo) => {
            expect(todo).toBeDefined();
            done();
        }).catch((e) => done(e));

        });

    });

    it('Should not update a invalid Object error (400).', (done) =>{

        var todo = {
            text: "Updated todo second",
            completed: false
        }

        request(app)
            .patch('/todos/123abc}')
            .send(todo)
        .expect(400)
        .end (done);
    });

    it('Should not update a inexistent todo (404)', (done) =>{

        var todo = {
            text: "Updated todo second",
            completed: false
        }

        request(app)
            .patch(`/todos/${new ObjectID().toHexString()}`)
            .send(todo)
        .expect(404)
        .end (done);
    });

});

describe('GET /users/me', () => {

    it('Should return user if authenticated.', (done) =>{

        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);

            })
            .end (done);
    });

    it('Should return 401 if not authenticated.', (done) =>{

        request(app)
        .get('/users/me')
        .expect(401)
        .end (done);

    });

});

describe('POST /users', () => {

    it('Should create a user.', (done) =>{

        var user = {     
        email: 'nandagomen@gmail.com',
        password: '123abc'
    };

        request(app)
            .post('/users')
            .send(user)
            .expect(201)
            .expect((res) => {
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(user.email);

            })
            .end(done);

    });

    it('Should return validation error if invalid request.', (done) =>{

        var user = {     
            email: 'nandagomengmail.com',
            password: '123abc'
        };

        request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .end(done);
});

    it('Should not create a user if email is in use.', (done) =>{

        var user = {     
            email: users[0].email,
            password: '123abc'
        };

        request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .end(done);
    });

});

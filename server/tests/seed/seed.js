const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'rodrigo.gomensoro@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'dudu.gomensoro@gmail.com',
    password: 'userTwoPass'
}];

const todos = [{
    _id: new ObjectID(),
    text: "my first test Todo"
},{
    _id: new ObjectID(),
    text: "my second test Todo",
    completed: true,
    completedAt: 123456
}];

const populateTodos = (done) => {
    Todo.remove({}).then (() => {
        Todo.insertMany(todos);
    }).then(()=> done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        Promise.all([userOne,userTwo])
    }).then(() => done());
};


module.exports = {todos,populateTodos,users,populateUsers};
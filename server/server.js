var env = process.env.NODE_ENV || 'development'
console.log ("env *****", env);

if (env === 'development') {

    process.env.PORT = 3000;
    process.env.MONGODB_URI =  'mongodb://localhost:27017/TodoApp'

} else if (env === 'test') {

    process.env.PORT = 3000;
    process.env.MONGODB_URI =  'mongodb://localhost:27017/TodoAppTest'

}

const _ = require("lodash");
const {ObjectID} = require ('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require ('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
const port = process.env.PORT

app.use(bodyParser.json());

//TODOS Routes
app.post('/todos', (req,res)=>{
    var todo = new Todo ({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.status(201).send(doc);
    }, (e) => {
       
        res.status(400).send(`Error. ${e.message}`);
    });

});

app.get('/todos', (req,res) => {

    Todo.find().then((todos) => {

        res.send({todos});

    }, e =>{
        res.status(400).send(`Error. ${e.message}`);
    });
});


app.get('/todos/:id', (req,res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)){
       return res.status(400).send(`Id not valid`);
    }
   
   Todo.findById(id).then((todo) => {
       if (!todo){
            return res.status(404).send(`Todo not found`);
       }
       res.send ({todo});
    }, e =>{
        res.status(400).send(`Error. ${e.message}`);
    });
});

app.delete('/todos/:id', (req,res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)){
       return res.status(400).send(`Id not valid`);
    }
   
   Todo.findByIdAndRemove(id).then((todo) => {
       if (!todo){
            return res.status(404).send(`Todo not found`);
       }

       res.send ({todo});

    }, e =>{
        res.status(400).send(`Error. ${e.message}`);
    });

});

app.patch('/todos/:id', (req,res) => {

    var id = req.params.id;
    var todo = _.pick(req.body, ['text','completed']);

    if (!ObjectID.isValid(id)){
        return res.status(400).send(`Id not valid`);
     }
    
    if (_.isBoolean(todo.completed) && todo.completed) {
        todo.completedAt = new Date().getTime();
    } else {
        todo.completed = false;
        todo.completedAt = null;
    }

    Todo.findByIdAndUpdate(id,
        { $set: todo}, {new: true }).then ((todo) => {
    
            if (!todo){
                return res.status(404).send(`Todo not found`);
           }
    
           res.send ({todo});

     }, e => {
        res.status(400).send(`Error. ${e.message}`);

    });

});

// USERS Routes
app.post('/users', (req,res)=>{
    
    var body = _.pick(req.body, ['email','password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).status(201).send(user);
    }, (e) => {

        res.status(400).send(`Error. ${e.message}`);
    });

});


app.listen(port, () => {
    if (port == 3000) {
        console.log('Started. Listen on local port 3.000');
    } else{
        console.log(`Started. Listen on port ${port}`);
    }
});

module.exports = {app};

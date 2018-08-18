const _ = require("lodash");
const {ObjectID} = require ('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require ('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());

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


app.listen(port, () => {
    if (port == 3000) {
        console.log('Started. Listen on local port 3.000');
    } else{
        console.log(`Started. Listen on port ${port}`);
    }
});

module.exports = {app};

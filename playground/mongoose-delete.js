const {ObjectID} = require ('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo');
const {User} = require ('./../server/models/user');

 var id = '5b75fec5ed40b33bc4e58acf';

 if (!ObjectID.isValid(id)){
     return console.log ('Object ID not valid');
 }

Todo.findByIdAndRemove(id).then((todo) => {
    console.log(todo);
});
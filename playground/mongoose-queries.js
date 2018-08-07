const {ObjectID} = require ('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo');
const {User} = require ('./../server/models/user');

 var id = '5b6795d24e3e380a708cd585';

 if (!ObjectID.isValid(id)){
     return console.log ('Object ID not valid');
 }

User.findById(id).then((user) => {
    if (!user){
        return console.log('User not found');
    }
    console.log ('User:', user);
});
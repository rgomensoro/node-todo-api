var mongoose = require ('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: { 
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

//User model
var User = mongoose.model('User', {
    email: { 
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
});

var newUser = new User({
    email: '  nandagomen@gmail.com   ',
});

newUser.save().then((doc) => {
    console.log (`save user: ${doc}`);
}, (e) =>{
    console.log(`Unable do save user: "${e.message}"`);
});

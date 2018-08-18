const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = '123bc';

bcrypt.genSalt(10, (err,salt) => {

    bcrypt.hash(password,salt, (err, hash) => {
        console.log('hash', hash);
    });
});

var hashedpassword = '123';

bcrypt.compare(password,hashedpassword, (err,res) => {
    
    console.log(res);

});


// var data = {
//     id: 4
// };

// var key = '123456';

// var token = jwt.sign(data,key);

//     console.log (`Token: ${token}`);

// var result = jwt.verify(token,key);

// console.log ('Data: ', data);
// console.log ('Result: ', result);

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // man in the middle

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();


// var resulthash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resulthash === token.hash) {
//     console.log ('VALID data.');
// } else {
//     console.log ('INVALID data.');
// }
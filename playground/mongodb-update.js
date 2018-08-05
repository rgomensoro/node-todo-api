const {MongoClient,ObjectID}  = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) =>{

    if (err) {
       return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');



    const db = client.db('TodoApp');
 

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b6771f50b09423f0c87b08c')
    // }, { $set: {
    //     completed: true
    //         }
    //     }, {
    //        returnOriginal: false 
    //     }).then ((res) => {
    
    //          console.log(JSON.stringify(res, undefined,2));
    
    //  }, (err) => {
    //          console.log('Unable to update todos',err);

    // });

    
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b6622b146f3f8159040a334')
    }, { $set: {
        name: 'Rodrigo'
            },
         $inc: {
             age: 35
         }
        }, {
           returnOriginal: false 
        }).then ((res) => {
    
             console.log(JSON.stringify(res, undefined,2));
    
     }, (err) => {
             console.log('Unable to update users',err);

    });

    client.close();

});
const {MongoClient,ObjectID}  = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) =>{

    if (err) {
       return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');
    
    // db.collection('Todos').find({
    //     _id: new ObjectID('5b6620918309f815bc6b93fb')
    // }).toArray().then ((docs) => {
    
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    
    // }, (err) => {

    // });

    db.collection('Users').find({name: 'Rodrigo'}).toArray().then ((docs) => {
    
             console.log(JSON.stringify(docs, undefined,2));
    
     }, (err) => {
             console.log('Unable to fetch todos',err);
     });



    client.close();

});

const {MongoClient,ObjectID}  = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) =>{

    if (err) {
       return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');



    const db = client.db('TodoApp');
 

    // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then ((res) => {
    
    //          console.log(JSON.stringify(res, undefined,2));
    
    //  }, (err) => {
    //          console.log('Unable to delete todos',err);
    //  });

    // db.collection('Todos').findOneAndDelete({completed: false}).then ((res) => {
    
    //          console.log(JSON.stringify(res, undefined,2));
    
    //  }, (err) => {
    //          console.log('Unable to delete todos',err);
    //  });


    db.collection('Users').deleteMany({name: 'Rodrigo'}).then ((res) => {
    
             console.log(JSON.stringify(res, undefined,2));
    
     }, (err) => {
             console.log('Unable to delete todos',err);

    });

    db.collection('Users').findOneAndDelete({_id: 123}).then ((res) => {
    
        console.log(JSON.stringify(res, undefined,2));

        }, (err) => {
        console.log('Unable to delete todos',err);

    });

    client.close();

});
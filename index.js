var express = require('express');
var mongojs = require('mongojs');

var app = express();

var port = process.env.PORT || 3000;

var connectionString = 'mongodb://admin:Password1!@cluster0-shard-00-00-90xxt.mongodb.net:27017,cluster0-shard-00-01-90xxt.mongodb.net:27017,cluster0-shard-00-02-90xxt.mongodb.net:27017/social?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

var db = mongojs(connectionString, ['users']);

app.use(express.static('public'));


app.get('/hello', (req, res) => {
    res.send("Hello world!!!");
});

app.get('/users', (req, res) => {
    db.users.find().sort({ name: 1 }, (err, docs) => {
        res.send(docs);
    });
});


app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
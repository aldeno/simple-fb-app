var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('public'));


app.get('/hello', (req, res)=>{
    res.send("Hello world!!!");
});

app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`);
});
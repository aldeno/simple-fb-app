var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

var app = express();

//Include body parsers and support for the encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 3000;

var connectionString = 'mongodb://admin:Password1!@cluster0-shard-00-00-90xxt.mongodb.net:27017,cluster0-shard-00-01-90xxt.mongodb.net:27017,cluster0-shard-00-02-90xxt.mongodb.net:27017/social?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

var db = mongojs(connectionString, ['users', 'friends', 'posts', 'comments', 'likes', 'messages']);

app.use(express.static('public'));


app.get('/hello', (req, res) => {
    res.send("Hello world!!!");
});

app.get('/users/:loggedInUser?', (req, res) => {

    //var dbFriends = mongojs(connectionString, ['friends']);
    var dbFriends = db;

    var usersCursor = db.users.find({ _id: { $ne: mongojs.ObjectId(req.params.loggedInUser) } }).sort({ name: 1 });
    var friendsCursor = dbFriends.friends.find({ "$or": [{ user1Id: req.params.loggedInUser }, { user2Id: req.params.loggedInUser }] });

    usersCursor.toArray((errUsers, arrUsers) => {
        friendsCursor.toArray((errFriends, arrFriends) => {
            //console.log(arrFriends);
            arrUsers.forEach(u => {
                var tempFriend = arrFriends.find(f => f.user1Id == u._id || f.user2Id == u._id);
                u.friend = tempFriend != undefined;
                u.friendId = tempFriend ? tempFriend._id : null;
            });
            res.send(arrUsers);
        });
    });
});


app.post('/user', (req, res) => {
    db.users.insert({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.username, password: req.body.password }, (err, saved) => {
        db.users.find({
            email: { $regex: new RegExp(`^${req.body.username}$`, "i") },
            password: req.body.password
        }, (err, docs) => {
            //Remove password from the response due to security
            var mapped = docs.map(x => {
                delete x.password;
                return x;
            });
            if (mapped.length > 0) {
                mapped[0].success = true;
                res.send(mapped[0]);
            }
            else {
                res.send({
                    success: false
                });
            }
        });
    });
});

app.post('/login', (req, res) => {
    //Search by username and password
    //Set username to be case insensitive
    db.users.find({
        email: { $regex: new RegExp(`^${req.body.username}$`, "i") },
        password: req.body.password
    }, (err, docs) => {
        //Remove password from the response due to security
        var mapped = docs.map(x => {
            delete x.password;
            return x;
        });
        if (mapped.length > 0) {
            mapped[0].success = true;
            res.send(mapped[0]);
        }
        else {
            res.send({
                success: false
            });
        }
    });
});

app.post('/post', (req, res) => {
    //var dbPosts = mongojs(connectionString, ['posts']);

    var dbPosts = db;

    dbPosts.posts.insert({ content: req.body.content, image: req.body.image, userId: req.body.userId, user: req.body.user }, (err, saved) => {
        res.send(true);
    });

});

app.post('/friend', (req, res) => {
    var dbFriends = db;//mongojs(connectionString, ['friends']);

    dbFriends.friends.insert({ user1Id: req.body.user1Id, user1: req.body.user1, user2Id: req.body.user2Id, user2: req.body.user2, date: new Date() }, (err, saved) => {
        res.send(true);
    });

});

app.delete('/friend/:friendId', (req, res) => {
    var dbFriends = db;// mongojs(connectionString, ['friends']);

    dbFriends.friends.remove({ _id: mongojs.ObjectId(req.params.friendId) }, true, (err, saved) => {
        res.send(true);
    });

});

app.delete('/post/:postId', (req, res) => {
    var dbPosts = db;//mongojs(connectionString, ['posts']);

    dbPosts.posts.remove({ _id: mongojs.ObjectId(req.params.postId) }, true, (err, saved) => {
        res.send(true);
    });

});

app.get('/posts/:loggedInUser?', (req, res) => {
    var dbPosts =db;// mongojs(connectionString, ['posts']);
    var dbFriends = db;//mongojs(connectionString, ['friends']);

    dbPosts.posts.find({}, null, { sort: { '_id': -1 } }, (err, posts) => {
        dbFriends.friends.find({ "$or": [{ user1Id: req.params.loggedInUser }, { user2Id: req.params.loggedInUser }] }, (err, friends) => {
            var filteredPosts = posts.filter(p => {
                return friends.find(f => f.user1Id == p.userId || f.user2Id == p.userId) != undefined || p.userId == req.params.loggedInUser;
            });

            res.send(filteredPosts);
        });
    });
});

app.post('/like', (req, res) => {
    var dbObj = db;//mongojs(connectionString, ['likes']);

    dbObj.likes.insert({ userId: req.body.userId, user: req.body.user, postId: req.body.postId }, (err, saved) => {
        res.send(true);
    });
});

app.get('/likes/:postId', (req, res) => {
    var dbObj = db;//mongojs(connectionString, ['likes']);

    dbObj.likes.find({ postId: req.params.postId }, (err, docs) => {
        res.send(docs);
    });
});


app.post('/message', (req, res) => {
    var dbObj = db;//mongojs(connectionString, ['messages']);

    dbObj.messages.insert({ senderId: req.body.senderId, recipientId: req.body.recipientId, sender: req.body.sender, recipient: req.body.recipient, message: req.body.message, date: new Date() }, (err, saved) => {
        console.log(err, saved);
        res.send(true);
    });

});

app.post('/comment', (req, res) => {
    var dbObj = db;//mongojs(connectionString, ['comments']);

    dbObj.comments.insert({ userId: req.body.userId, user: req.body.user, postId: req.body.postId, comment: req.body.comment, date: new Date() }, (err, saved) => {
        console.log(err, saved);
        res.send(true);
    });

});

app.get('/comments/:postId', (req, res) => {
    var dbObj = db;//mongojs(connectionString, ['comments']);

    dbObj.comments.find({ postId: req.params.postId }, (err, docs) => {
        res.send(docs);
    });
});

app.get('/messages/:userId/:recipientId', (req, res) => {
    var dbObj = db;//mongojs(connectionString, ['messages']);

    console.log(req.params);
    dbObj.messages.find({ "$or": [{ senderId: req.params.userId, recipientId: req.params.recipientId }, { senderId: req.params.recipientId, recipientId: req.params.userId }] }, (err, messages) => {
        res.send(messages);
    });
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
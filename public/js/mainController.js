app.controller('mainCtrl', function ($scope, $http, postSvc, loginSvc) {
    $scope.posts = [];
    $scope.newPost = {};
    $scope.user = loginSvc.getCurrentUser();
    $scope.allUsers = [];

    $scope.chat = {};

    $scope.getPosts = () => {
        postSvc.getPosts($scope.user._id).then(res => {
            $scope.posts = res.data;

            for (p in $scope.posts) {
                (function (i) {
                    postSvc.getPostLikes($scope.posts[i]._id).then((likes) => {
                        $scope.posts[i].likes = likes.data;
                        $scope.posts[i].likesNumber = likes.data.length;
                        $scope.posts[i].liked = likes.data.find(x => x.userId == $scope.user._id) != undefined;
                    });
                    postSvc.getPostComments($scope.posts[i]._id).then((comments) => {
                        $scope.posts[i].comments = comments.data;
                        $scope.posts[i].commentsNumber = comments.data.length;
                    });
                })(p);
            }
        });
    };

    $scope.getPosts();

    $scope.getAllUsers = () => {
        postSvc.getUsers($scope.user._id).then(res => {
            $scope.allUsers = res.data;
        });
    }

    $scope.getAllUsers();

    $scope.post = () => {
        postSvc.post($scope.user._id, $scope.newPost.text, $scope.newPost.image, $scope.user.firstName + ' ' + $scope.user.lastName).then(() => {
            $scope.getPosts();
        });
    }

    $scope.like = (post) => {
        if (post.liked) {
            return;
        }
        postSvc.like($scope.user._id, $scope.user.firstName + ' ' + $scope.user.lastName, post._id).then(() => {
            $scope.getPosts();
        });
    }

    $scope.removePost = (post) => {
        postSvc.deletePost(post._id).then(() => {
            $scope.getPosts();
        });
    }

    $scope.removeFriend = (user) => {
        postSvc.removeFriend(user.friendId).then(() => {
            $scope.getAllUsers();
        });
    }

    $scope.showComment = (post) => {
        post.commentShown = !post.commentShown;

        if (!post.commentShown) {
            post.comment = null;
        }
    }

    $scope.addComment = (post) => {
        postSvc.addComment(post._id, $scope.user._id, $scope.user.firstName + ' ' + $scope.user.lastName, post.comment).then(() => {
            $scope.getPosts();
        });
    }

    $scope.addFriend = (usr) => {
        var friendObj = {
            user1Id: usr._id,
            user1: usr.firstName + ' ' + usr.lastName,
            user2Id: $scope.user._id,
            user2: $scope.user.firstName + ' ' + $scope.user.lastName,
        };

        postSvc.addFriend(friendObj).then(data => {
            $scope.getAllUsers();
        });
    }

    $scope.startChat = (user) => {
        $scope.chat = {};

        $scope.chat.user = user;

        $scope.getMessages(user._id);
    }

    $scope.closeChat = ()=>{
        $scope.chat = {};
    }

    $scope.sendMessage = (event) => {
        if (event.type != 'keypress' || event.keyCode != 13) {
            return;
        }

        postSvc.sendMessage($scope.user._id, $scope.user.firstName + ' ' + $scope.user.lastName, $scope.chat.user._id, $scope.chat.user.firstName + ' ' + $scope.chat.user.lastName, $scope.chat.message).then(data => {
            $scope.getMessages($scope.chat.user._id);
        });
        $scope.chat.message = "";
    }

    $scope.getMessages = (userId) => {
        postSvc.getMessages($scope.user._id, userId).then(res=>{
            $scope.chat.messages = res.data;
            console.log($scope.chat);
        });
    }

    function scrollChatToBottom() {
        var element = document.getElementById("chat");
        element.scrollTop = element.scrollHeight;
    }

});
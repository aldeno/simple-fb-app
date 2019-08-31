app.service('postSvc', function ($http, $location) {
    var serverUrl = 'https://sample-social-network.herokuapp.com';
    serverUrl = "https://sample-social-network.herokuapp.com";

    return {
        post: function (userId, content, image, user) {
            var postObj = {
                userId: userId,
                content: content,
                image: image,
                user: user
            };

            return $http.post(`${serverUrl}post`, postObj);
        },
        deletePost: function (postId) {
            return $http.delete(`${serverUrl}post/${postId}`);
        },
        getPosts: (userId) => {
            return $http.get(`${serverUrl}posts/${userId}`);
        },
        like: function (userId, user, postId) {
            var likeObj = {
                userId: userId,
                postId: postId,
                user: user
            };

            return $http.post(`${serverUrl}like`, likeObj);
        },
        getPostLikes: function (postId) {
            return $http.get(`${serverUrl}likes/${postId}`);
        },
        addComment: function (postId, userId, user, comment) {
            var commentObj = {
                userId: userId,
                comment: comment,
                postId: postId,
                user: user
            };

            return $http.post(`${serverUrl}comment`, commentObj);
        },
        getPostComments: function (postId) {
            return $http.get(`${serverUrl}comments/${postId}`);
        },

        getUsers: function (userId) {
            return $http.get(`${serverUrl}users/${userId || ''}`);
        },

        addFriend: function (requestObj) {
            return $http.post(`${serverUrl}friend`, requestObj);
        },
        removeFriend: function (userId) {
            return $http.delete(`${serverUrl}friend/${userId}`);
        },
        sendMessage: function (senderId, sender, recipientId, recipient, message) {
            var messageObj = {
                senderId: senderId,
                sender: sender,
                recipientId: recipientId,
                recipient: recipient,
                message: message
            };
            return $http.post(`${serverUrl}message`, messageObj);
        },
        getMessages: function (userId, recipientId) {
            return $http.get(`${serverUrl}messages/${userId}/${recipientId}`);
        },
    }
});
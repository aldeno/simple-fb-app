app.service('loginSvc', function ($http, $location) {
    var serverUrl = 'http://localhost:3000/';
    var AUTH_KEY = "social_credentials";

    return {
        checkCredentials: function (username, password) {
            var postObj = {
                username: username,
                password: password,
            };

            return $http.post(`${serverUrl}login`, postObj);
        },
        login: function (userData) {

            localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
            $location.path('/');
            return true;
        },
        register: function (firstName, lastName, username, password) {
            var postObj = {
                firstName: firstName,
                lastName, lastName,
                username: username,
                password: password,
            };

            return $http.post(`${serverUrl}user`, postObj);
        },

        isAuthenticated: function () {
            if (this.getCurrentUser() == null || this.getCurrentUser() == undefined) {
                return false;
            }
            return true;
        },

        getCurrentUser: function () {
            var currentUser = localStorage.getItem(AUTH_KEY);
            try {
                return JSON.parse(currentUser);
            } catch (error) {}
            return currentUser;
        },

        logout: function () {
            localStorage.removeItem(AUTH_KEY);
        }
    }
});
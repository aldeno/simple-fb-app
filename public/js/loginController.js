app.controller('loginCtrl', function ($scope, $http, loginSvc) {

    $scope.loginInfo = {};


    $scope.login = () => {
        loginSvc.checkCredentials($scope.loginInfo.username, $scope.loginInfo.password).then(function (data) {
            if (data.data.success) {
                loginSvc.login(data.data);
            }
        },
            function (err) {
                console.error(err);
            });
    }
});
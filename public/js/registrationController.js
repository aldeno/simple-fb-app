app.controller('registrationCtrl', function ($scope, $http, loginSvc) {

    $scope.loginInfo = {};


    $scope.register = () => {
        loginSvc.register($scope.registration.firstName, $scope.registration.lastName, $scope.registration.username, $scope.registration.password).then(function (data) {
            if (data.data.success) {
                loginSvc.login(data.data);
            }
        },
            function (err) {
                console.error(err);
            });
    }
});
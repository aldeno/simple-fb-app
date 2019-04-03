
var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "./templates/main.html",
        controller: 'mainCtrl'
    })
    .when('/login', {
        templateUrl: "./templates/login.html",
        controller: 'loginController'
    })
    .otherwise({
        redirectTo: '/'
    });
});

var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "./templates/main.html",
        controller: 'mainCtrl'
    })
    .when('/login', {
        templateUrl: "./templates/login.html",
        controller: 'loginCtrl'
    })
    .when('/registration', {
        templateUrl: "./templates/registration.html",
        controller: 'registrationCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
});

app.run(function ($rootScope, $location, loginSvc) {

    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        
        if(!next.endsWith("/login") && !next.endsWith("/registration")){
            
            authenticated = loginSvc.isAuthenticated();
            if(!authenticated){
                $location.path('/login');
                event.preventDefault();
            }
        }
    });

});
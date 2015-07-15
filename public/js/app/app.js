'use strict';


function AppConfig($routeProvider, RestangularProvider) {
    $routeProvider.otherwise({redirectTo: '/login'});

    RestangularProvider.setBaseUrl('/api/');
}

function AppRun($rootScope, $location, User) {

    var user = User.get();

    // check if user is known
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (!Object.keys(User.get()).length) {
            $location.path('/login');
        }
    });
}

function AppCheckSupport($window) {

    var support = {};
    support.unsupported = false;

    if (!$window.hasOwnProperty('WebSocket')) {
        support.unsupported = true;
        support.error = 'Your browser does not support technologies used in this app. Please upgrade your browser to run this application';
    }

    return support;

}

function AppAutoFocusDirective() {
    return {
        restrict: 'AC',
        link: function (scope, element) {
            element[0].focus();
        }
    };
}

angular.module('ncApp', [
        'ngRoute',
        'ncApp.login',
        'ncApp.chat',
        'restangular'
])
    .config(['$routeProvider', 'RestangularProvider', AppConfig])
    .run(['$rootScope', '$location', 'User', AppRun])
    .factory('isSupported', ['$window', AppCheckSupport])
    .directive('autoFocus', [AppAutoFocusDirective]);

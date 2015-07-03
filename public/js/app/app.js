'use strict';


function AppConfig($routeProvider, RestangularProvider) {
    $routeProvider.otherwise({redirectTo: '/login'});

    RestangularProvider.setBaseUrl('/api/');

}

function AppRun($rootScope, $location) {

    // check if user is known
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (!$rootScope.user) {
            $location.path('/login');
        }
    });
}

function AppAutoFocusDirective($timeout) {
    return {
        restrict: 'AC',
        link: function (scope, element) {
            $timeout(function () {
                element[0].focus();
            }, 10);
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
    .run(AppRun)
    .directive('autoFocus', ['$timeout', AppAutoFocusDirective]);

'use strict';

angular.module('ncApp', [
    'ngRoute',
    'ncApp.chat'
])
    .config(['$routeProvider', function ($routeProvider) {
       $routeProvider.otherwise({redirectTo: '/chat'});
    }]);

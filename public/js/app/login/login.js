(function () {
    'use strict';

    function LoginConfig($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/js/app/login/login.html',
            controller: 'LoginCtrl as vm'
        });
    }

    function LoginCtrl($rootScope, $scope, $location, $http, Restangular) {
        var vm = this;

        $scope.login = function () {
            if ($scope.login.username.length) {

                Restangular.one('users', $scope.login.username).put().then(function (data) {
                    $rootScope.user = data.plain();
                    $location.path('/chat');

                }, function (data) {
                    if (data.data.hasOwnProperty('error')) {
                        $scope.error = data.data.error;
                    }
                });
            }
        };
    }

    // assigns whole stuff to angular methods
    angular.module('ncApp.login', ['ngRoute', 'restangular'])
        .config(['$routeProvider', LoginConfig])
        .controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$http', 'Restangular', LoginCtrl]);

})();

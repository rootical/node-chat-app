(function () {
    'use strict';

    function LoginConfig($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/js/app/login/login.html',
            controller: 'LoginCtrl as vm'
        });
    }

    function LoginCtrl($rootScope, $scope, $location, $http) {

        var vm = this;

        $scope.login = function () {
            if($scope.login.username.length) {
                $http.get('/api/users/' + $scope.login.username).then(function(data) {
                    $rootScope.user = data.data;
                    $location.path('/chat');
                });
            }
        };

    }

    /*
    function LoginSessionFactory($http) {
        var Session = {
            data: {},
            saveSession: function () {
                //TODO save session data to db
            },
            updateSession: function () {
                //TODO load session from api (db)


                //Session.data = $http.get('session.json').then(function(r) { return r.data;});
            }
        };

        Session.updateSession();

        return Session;
    }*/

    // assigns whole stuff to angular methods
    angular.module('ncApp.login', ['ngRoute'])
        .config(['$routeProvider', LoginConfig])
        .controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$http', LoginCtrl]);

})();

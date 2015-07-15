(function () {
    'use strict';

    function LoginConfig($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/js/app/login/login.html',
            controller: 'LoginCtrl as vm'
        });
    }

    function LoginCtrl($scope, $location, $http, User, Restangular, Geolocation, isSupported) {
        var vm = this,
            user;


        if (navigator.geoloation !== 'undefined') {
            user = User.get();

            navigator.geolocation.getCurrentPosition(function (position) {
                user.position = {};
                user.position.longitude = position.coords.longitude;
                user.position.latitude = position.coords.latitude;

                User.set(user);
            });
        }


        // check if there are soultions that allows to run the application
        angular.extend($scope, isSupported);

        $scope.login = function () {
            if ($scope.login.username.length) {

                Restangular.one('users', $scope.login.username)
                    .put()
                    .then(function (userData) {

                        user = User.get();
                        angular.extend(user, userData.plain()); //FIXME angular 1.4 has .merge function for deep copy, replace it
                        User.set(user);

                        Geolocation();

                        $location.path('/chat');

                    }, function (data) {
                        if (data.data.hasOwnProperty('error')) {
                            $scope.error = data.data.error;
                        }
                    });
            }
        };
    }

    function Geolocation(User, Restangular, GeolocationIp) {
        var geo = function () {

            var long,
                lat,
                user = User.get(),
                fallback = function (data) {
                    GeolocationIp.get();
                };

            if (!user.position) {
                fallback();
                return;
            }

            Restangular.one('geocode/coordinates/' + user.position.longitude + '/' + user.position.latitude).get().then(function (location) {
                user.location = location.plain();
                User.set(user);
            }, fallback);
        };

        return (geo);
    }

    function GeolocationIp(User, Restangular) {
        var user = User.get();

        return {
            get: function () {
                Restangular.one('geocode/ip').get().then(function (location) {
                    user.location = location.plain();
                    User.set(user);
                }, function (data) {
                    user.location = {};
                    User.set(user);
                });
            }
        };
    }

    /**
     *
     * Simple factory for holding current user data
     *
     */
    function User() {

        var user = {};

        function set (data) {
            user = data;
        }

        function get () {
            return user;
        }

        return {
            set: set,
            get: get
        }
    }

    // assigns whole stuff to angular methods
    angular.module('ncApp.login', ['ngRoute', 'restangular'])
        .config(['$routeProvider', LoginConfig])
        .factory('GeolocationIp', ['User', 'Restangular', GeolocationIp])
        .factory('Geolocation', ['User', 'Restangular', 'GeolocationIp', Geolocation])
        .factory('User', User)
        .controller('LoginCtrl', ['$scope', '$location', '$http', 'User', 'Restangular', 'Geolocation', 'isSupported', LoginCtrl]);
})();

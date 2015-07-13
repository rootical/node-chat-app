(function () {
    'use strict';

    function LoginConfig($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/js/app/login/login.html',
            controller: 'LoginCtrl as vm'
        });
    }

    function LoginCtrl($rootScope, $scope, $location, $http, Restangular, Geolocation) {
        var vm = this;


        if (navigator.geoloation !== 'undefined') {
            navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.position = {};
                $rootScope.position.longitude = position.coords.longitude;
                $rootScope.position.latitude = position.coords.latitude;
            });
        }

        $scope.login = function () {
            if ($scope.login.username.length) {

                Restangular.one('users', $scope.login.username)
                    .put()
                    .then(function (user) {

                        $rootScope.user = user.plain();

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

    function Geolocation($rootScope, Restangular, GeolocationIp) {
        var geo = function () {

            var long,
                lat,
                fallback = function (data) {
                    GeolocationIp.get();
                };

            if (!$rootScope.position) {
                fallback();
                return;
            }

            Restangular.one('geocode/coordinates/' + $rootScope.position.longitude + '/' + $rootScope.position.latitude).get().then(function (location) {
                $rootScope.user.location = location.plain();
            }, fallback);
        };

        return (geo);
    }


    function GeolocationIp($rootScope, Restangular) {
        return {
            get: function () {
                Restangular.one('geocode/ip').get().then(function (location) {
                    $rootScope.user.location = location.plain();

                }, function (data) {
                    $rootScope.user.location = {};
                });
            }
        };
    }

    // assigns whole stuff to angular methods
    angular.module('ncApp.login', ['ngRoute', 'restangular'])
        .config(['$routeProvider', LoginConfig])
        .factory('GeolocationIp', ['$rootScope', 'Restangular', GeolocationIp])
        .factory('Geolocation', ['$rootScope', 'Restangular', 'GeolocationIp', Geolocation])
        .controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$http', 'Restangular', 'Geolocation', LoginCtrl]);
})();

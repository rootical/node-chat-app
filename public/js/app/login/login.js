(function () {
    'use strict';

    function LoginConfig($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/js/app/login/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'vm'
        });
    }

    function LoginCtrl($location, User, Restangular, Geolocation, isSupported) {
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
        angular.extend(vm, isSupported);

        vm.login = (vm.login.bind(vm, $location, Restangular, User, Geolocation));
    }

    LoginCtrl.prototype.login = function ($location, Restangular, User, Geolocation) {
        var vm = this,
            user = User.get();

        if (vm.login.username.length) {
            Restangular.one('users', vm.login.username)
                .put()
                .then(function (userData) {

                    user = User.get();
                    angular.merge(user, userData.plain());
                    User.set(user);

                    Geolocation();

                    $location.path('/chat');

                }, function (data) {
                    if (data.data.hasOwnProperty('error')) {
                        vm.error = data.data.error;
                    }
                });
        }
    };

    function GeolocationFactory(User, Restangular, GeolocationIp) {
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

    function GeolocationIpFactory(User, Restangular) {
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
    function UserFactory() {

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
        .factory('GeolocationIp', ['User', 'Restangular', GeolocationIpFactory])
        .factory('Geolocation', ['User', 'Restangular', 'GeolocationIp', GeolocationFactory])
        .factory('User', UserFactory)
        .controller('LoginCtrl', ['$location', 'User', 'Restangular', 'Geolocation', 'isSupported', LoginCtrl]);
})();

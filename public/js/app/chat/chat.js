(function () {
    'use strict';

    function ChatConfig($routeProvider) {
        $routeProvider.when('/chat', {
            templateUrl: '/js/app/chat/chat.html',
            controller: 'ChatCtrl as vm'
        });
    }

    function ChatCtrl($rootScope, $scope) {

        var vm = this;

        $scope.messages = [];
        $scope.keyBindings = vm.keyBindings;
        $scope.user = $rootScope.user;

        vm.ws = new WebSocket("ws://" + window.location.host); // NOTE investigate this "location.host" if it isn't causing any troubles

        vm.ws.onopen = (vm.wsOnOpen.bind(vm, $scope));
        vm.ws.onmessage = (vm.wsOnMessage.bind(vm, $scope));
    }

    ChatCtrl.prototype.wsOnOpen = function ($scope, wsEvent) {

        var vm = this;

        $scope.connectionEstablished = 1;
        $scope.send = function () {
            if ($scope.chat.message.length) {

                var pkg = {}; // message package
                pkg.content = $scope.chat.message;
                pkg.user = $scope.user;

                vm.ws.send(JSON.stringify(pkg));

                $scope.chat.message = '';
            }
        };

        // updates bindings and watchers
        $scope.$digest();

    };

    ChatCtrl.prototype.wsOnMessage = function ($scope, wsEvent) {

        var vm = this,
            pkg;

        try {

            pkg = JSON.parse(wsEvent.data);

        } catch (err) {

        } finally {
            $scope.messages.push({
                author: pkg.user.name,
                content: pkg.content,
                timestamp: '',
                color: pkg.user.color,
                role: pkg.user.role
            });

            // updates bindings and watchers
            $scope.$digest();
        }
    };

    ChatCtrl.prototype.keyBindings = function (event) {

        switch(event.keyCode) {
            // return key
            case 13:
                this.send();
                break;

            default:
                //TODO: "Someone is writing right now" functionality
        }
    };

    // assigns whole stuff to angular methods
    angular.module('ncApp.chat', ['ngRoute'])
        .config(['$routeProvider', ChatConfig])
        .controller('ChatCtrl', ['$rootScope', '$scope', ChatCtrl]);

})();

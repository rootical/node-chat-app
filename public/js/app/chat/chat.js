(function () {
    'use strict';

    function ChatConfig($routeProvider) {
        $routeProvider.when('/chat', {
            templateUrl: '/js/app/chat/chat.html',
            controller: 'ChatCtrl as vm'
        });
    }

    function ChatCtrl($scope) {

        var vm = this;

        $scope.messages = [];
        $scope.keyBindings = vm.keyBindings;

        vm.ws = new WebSocket("ws://" + window.location.host); // NOTE investigate this "location.host" if it isn't causing any troubles

        vm.ws.onopen = (vm.wsOnOpen.bind(vm, $scope));
        vm.ws.onmessage = (vm.wsOnMessage.bind(vm, $scope));
    }

    ChatCtrl.prototype.wsOnOpen = function ($scope, wsEvent) {

        var vm = this;

        $scope.connectionEstablished = 1;
        $scope.send = function () {
            if ($scope.chat.message.length) {
                vm.ws.send($scope.chat.message);
                $scope.chat.message = '';
            }
        };

        // updates bindings and watchers
        $scope.$digest();

    };

    ChatCtrl.prototype.wsOnMessage = function ($scope, wsEvent) {

        var vm = this;

        $scope.messages.push({
            author: '',
            content: wsEvent.data,
            timestamp: ''
        });

        // updates bindings and watchers
        $scope.$digest();
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
        .controller('ChatCtrl', ['$scope', ChatCtrl]);

})();

(function () {
    'use strict';

    function ChatConfig($routeProvider) {
        $routeProvider.when('/chat', {
            templateUrl: '/js/app/chat/chat.html',
            controller: 'ChatCtrl as vm'
        });
    }

    function ChatCtrl($rootScope, $scope, Restangular) {

        var vm = this;

        vm.scope = $scope;
        vm.scope.messages = [];
        vm.scope.keyBindings = vm.keyBindings;

        vm.scope.user = $rootScope.user;

        vm.restangular = Restangular;

        vm.ws = new WebSocket("ws://" + window.location.host); // NOTE investigate this "location.host" if it isn't causing any troubles

        vm.ws.onopen = (vm.wsOnOpen.bind(vm));
        vm.ws.onmessage = (vm.wsOnMessage.bind(vm));
        vm.ws.onclose = (vm.wsOnClose.bind(vm));

        window.onbeforeunload = function () {
            vm.ws.close();
        };
    }

    ChatCtrl.prototype.wsOnOpen = function (wsEvent) {

        var vm = this;

        vm.scope.connectionEstablished = 1;
        vm.scope.send = (vm.sendMessage.bind(vm));


        // get last messages
        vm.restangular.all('messages').getList().then(function(result) {
            vm.scope.messages = result;
            //vm.scope.messages = Restangular.all('accounts').getList().$object;
        });

        // updates bindings and watchers
        vm.scope.$digest();

    };

    ChatCtrl.prototype.wsOnMessage = function (wsEvent) {

        var vm = this,
            pkg;

        try {
            pkg = JSON.parse(wsEvent.data);
        } catch (err) {

            //TODO error

        } finally {
            vm.scope.messages.push({
                author: pkg.user.name,
                content: pkg.content,
                timestamp: '',
                color: pkg.user.color,
                role: pkg.user.role,
                language: pkg.user.language
            });

            // updates bindings and watchers
            vm.scope.$digest();
        }
    };

    ChatCtrl.prototype.wsOnClose = function (wsEvent) {
        var vm = this;

        vm.restangular.one('users', vm.scope.user.name).remove();
    }

    ChatCtrl.prototype.sendMessage = function () {

        var pkg = {}, // message package
            vm = this;

        if (!vm.scope.chat.message.length) {
            return;
        }

        pkg.content = vm.scope.chat.message;
        pkg.user = vm.scope.user;

        vm.ws.send(JSON.stringify(pkg));

        vm.scope.chat.message = '';
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
    // 'luegg.directives' - scroll on adding new line to pane
    angular.module('ncApp.chat', [
        'ngRoute',
        'luegg.directives',
        'restangular'
    ])
        .config(['$routeProvider', ChatConfig])
        .controller('ChatCtrl', ['$rootScope', '$scope', 'Restangular', ChatCtrl]);

})();

/*jslint nomen: true */
(function () {
    'use strict';

    function ChatConfig($routeProvider) {
        $routeProvider.when('/chat', {
            templateUrl: '/js/app/chat/chat.html',
            controller: 'ChatCtrl',
            controllerAs: 'vm'
        });
    }

    function ChatCtrl($scope, $window, User, Restangular) {
        var vm = this;
        vm.messages = [];
        vm.keyBindings = vm.keyBindings;
        vm.writing = false;
        vm.wip = []; //writing in progress user set

        // current user data
        vm.user = User.get();

        vm.restangular = Restangular;

        vm.ws = new WebSocket("ws://" + $window.location.host);

        vm.ws.onopen = (vm.wsOnOpen.bind(vm, $scope));
        vm.ws.onmessage = (vm.wsOnMessage.bind(vm, $scope));
        vm.ws.onclose = (vm.wsOnClose.bind(vm));

        vm.deleteMessage = (vm.deleteMessage.bind(vm));

        $window.onbeforeunload = function () {
            vm.ws.close();
        };
    }

    ChatCtrl.prototype.wsOnOpen = function (scope, wsEvent) {

        var vm = this;

        vm.connectionEstablished = 1;
        vm.send = (vm.sendMessage.bind(vm));


        // get last messages
        vm.restangular.all('messages').getList().then(function (result) {
            vm.messages = result.plain();
            //vm.messages = Restangular.all('accounts').getList().$object;
        });

        // updates bindings and watchers
        scope.$digest();
    };

    ChatCtrl.prototype.wsOnMessage = function (scope, wsEvent) {

        var vm = this,
            pkg,
            index;

        try {
            pkg = JSON.parse(wsEvent.data);
        } catch (err) {

            //TODO error

        } finally {

            switch (pkg.broadcast) {

            case 'maintenance':

                switch (pkg.type) {
                case 'wip': // writing in progres start

                    if (pkg.user.name !== vm.user.name) {
                        vm.wip.push(pkg.user.name);
                    }

                    break;

                case 'wipe': // writing in progres end

                    index = vm.wip.indexOf(pkg.user.name);

                    if (index > -1) {
                        vm.wip.splice(index, 1);
                    }

                    break;

                case 'del': // delete message

                    vm.messages = vm.messages.map(function (item) {
                        return item._id === pkg._id ? pkg : item;
                    });

                    break;
                }

                break;

            default:

                delete pkg.updated_at;
                delete pkg.hidden;

                vm.messages.push(pkg);
            }


            // updates bindings and watchers
            scope.$digest();
        }
    };

    ChatCtrl.prototype.wsOnClose = function (wsEvent) {
        var vm = this;
        vm.restangular.one('users', vm.user.name).remove();
    };

    ChatCtrl.prototype.sendMessage = function () {

        var pkg = {}, // message package
            vm = this;

        if (!vm.chat.message.length) {
            return;
        }

        pkg.content = vm.chat.message;
        pkg.user = vm.user;

        vm.ws.send(JSON.stringify(pkg));

        vm.chat.message = '';

        // clear writing in progress
        clearInterval(vm.timeout);
        vm.endOfWriting();

    };

    ChatCtrl.prototype.deleteMessage = function (id) {
        var vm = this;

        if (vm.user.role !== 'ADMIN') {
            return;
        }

        // remove
        vm.restangular.one('messages', id).remove();

    };

    //TODO: "Someone is writing right now" functionality
    ChatCtrl.prototype.writingInProgress = function (event) {
        var vm = this,
            message = {};

        // start writing
        if (!vm.writing) {
            vm.writing = true;

            message.broadcast = 'maintenance';
            message.type = 'wip';
            message.user = vm.user;

            vm.ws.send(JSON.stringify(message));
        }

        // writing in progress
        clearInterval(vm.timeout);

        // end of writing
        vm.timeout = setTimeout(function () {
            vm.endOfWriting();
        }, 5000);
    };

    ChatCtrl.prototype.endOfWriting = function (event) {
        var vm = this,
            message = {};

        message.broadcast = 'maintenance';
        message.type = 'wipe';
        message.user = vm.user;

        vm.ws.send(JSON.stringify(message));

        vm.writing = false;
    };

    ChatCtrl.prototype.keyBindings = function (event) {

        switch (event.keyCode) {

        // return key
        case 13:
            this.send();
            break;

        default:
            this.writingInProgress(event);
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
        .controller('ChatCtrl', ['$scope', '$window', 'User', 'Restangular', ChatCtrl]);

})();

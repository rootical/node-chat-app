/*jslint nomen: true */
(function () {
    'use strict';

    function ChatConfig($routeProvider) {
        $routeProvider.when('/chat', {
            templateUrl: '/js/app/chat/chat.html',
            controller: 'ChatCtrl as vm'
        });
    }

    function ChatCtrl($scope, $window, User, Restangular) {

        var vm = this;

        vm.scope = $scope;
        vm.scope.messages = [];
        vm.scope.keyBindings = vm.keyBindings;
        vm.scope.writing = false;
        vm.scope.wip = []; //writing in progress user set

        // current user data
        vm.scope.user = User.get();

        vm.restangular = Restangular;

        vm.ws = new WebSocket("ws://" + $window.location.host);

        vm.ws.onopen = (vm.wsOnOpen.bind(vm));
        vm.ws.onmessage = (vm.wsOnMessage.bind(vm));
        vm.ws.onclose = (vm.wsOnClose.bind(vm));

        vm.scope.deleteMessage = (vm.deleteMessage.bind(vm));

        $window.onbeforeunload = function () {
            vm.ws.close();
        };
    }

    ChatCtrl.prototype.wsOnOpen = function (wsEvent) {

        var vm = this;

        vm.scope.connectionEstablished = 1;
        vm.scope.send = (vm.sendMessage.bind(vm));


        // get last messages
        vm.restangular.all('messages').getList().then(function (result) {
            vm.scope.messages = result.plain();
            //vm.scope.messages = Restangular.all('accounts').getList().$object;
        });

        // updates bindings and watchers
        vm.scope.$digest();

    };

    ChatCtrl.prototype.wsOnMessage = function (wsEvent) {

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

                    if (pkg.user.name !== vm.scope.user.name) {
                        vm.scope.wip.push(pkg.user.name);
                    }

                    break;

                case 'wipe': // writing in progres end

                    index = vm.scope.wip.indexOf(pkg.user.name);

                    if (index > -1) {
                        vm.scope.wip.splice(index, 1);
                    }

                    break;

                case 'del': // delete message

                    vm.scope.messages = vm.scope.messages.map(function (item) {
                        return item._id === pkg._id ? pkg : item;
                    });

                    break;
                }

                break;

            default:

                delete pkg.updated_at;
                delete pkg.hidden;

                vm.scope.messages.push(pkg);
            }


            // updates bindings and watchers
            vm.scope.$digest();
        }
    };

    ChatCtrl.prototype.wsOnClose = function (wsEvent) {
        var vm = this;
        vm.restangular.one('users', vm.scope.user.name).remove();
    };

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

        // clear writing in progress
        clearInterval(vm.scope.timeout);
        vm.endOfWriting();

    };

    ChatCtrl.prototype.deleteMessage = function (id) {
        var vm = this;

        if (vm.scope.user.role !== 'ADMIN') {
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
        if (!vm.scope.writing) {
            vm.scope.writing = true;

            message.broadcast = 'maintenance';
            message.type = 'wip';
            message.user = vm.scope.user;

            vm.ws.send(JSON.stringify(message));
        }

        // writing in progress
        clearInterval(vm.scope.timeout);

        // end of writing
        vm.scope.timeout = setTimeout(function () {
            vm.endOfWriting();
        }, 5000);
    };

    ChatCtrl.prototype.endOfWriting = function (event) {
        var vm = this,
            message = {};

        message.broadcast = 'maintenance';
        message.type = 'wipe';
        message.user = vm.scope.user;

        vm.ws.send(JSON.stringify(message));

        vm.scope.writing = false;
    };

    ChatCtrl.prototype.keyBindings = function (event) {

        switch (event.keyCode) {

        // return key
        case 13:
            this.send();
            break;

        default:
            this.vm.writingInProgress(event);
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

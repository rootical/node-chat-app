var config = {};

config.routes = {};

// action routes
config.routes.login = {
    url: '/login',
    template: '/js/app/login/login.html'
};
config.routes.chat = {
    url: '/chat',
    template: '/js/app/chat/chat.html'
};

// rest routes
config.routes.rest = {};
config.routes.rest.base = '/api/';
config.routes.rest.geocode = {
    coordinates: 'geocode/coordinates/',
    ip: 'geocode/ip/'
};

// setup module
angular.module('ncApp.config', [])
    .constant('appConfig', config);

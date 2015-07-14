/*jslint node: true */

var routes = {};

routes.base = {path: '/api'};

// geocode action
routes.geocode = {};
routes.geocode.get = {};

routes.geocode.get.coordinates = {path: routes.base.path + '/geocode/coordinates/:long/:lat'};
routes.geocode.get.ip = {path: routes.base.path + '/geocode/ip'};

// messages action
routes.messages = {};
routes.messages.get = {};
routes.messages.get.messages = {path: routes.base.path + '/messages'};

routes.messages.delete = {};
routes.messages.delete.messages = {path: routes.base.path + '/messages/:id'};

// users action
routes.users = {};
routes.users.put = {};
routes.users.put.users = {path: routes.base.path + '/users/:username'};

routes.users.delete = {};
routes.users.delete.users = {path: routes.base.path + '/users/:username'};


module.exports = routes;

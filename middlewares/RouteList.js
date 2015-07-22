/*jslint node: true */
'use strict';

var express = require('express'),
    router = express.Router(),

    RouteList = function (app) {
        this.app = app;
    };

RouteList.prototype.retrieve = function () {
    var route,
        routes = [];

    this.app._router.stack.forEach(function (middleware) {
        //if (middleware.route) {
            // routes registered directly on the app
            //routes.push(middleware.route);
        //}
        if (middleware.name === 'router') {
            // router middleware
            middleware.handle.stack.forEach(function (handler) {
                route = handler.route;

                if (route) {
                    routes.push({
                        path: route.path,
                        methods: route.methods
                    });
                }
            });
        }
    });

    // sort it by path
    routes.sort(function (a, b) {
        return a.path > b.path;
    });

    return routes;
};

module.exports.RouteList = RouteList;

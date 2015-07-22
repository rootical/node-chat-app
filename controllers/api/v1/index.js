/*jslint node: true */
'use strict';

var express = require('express'),
    router = express.Router(),

    RouteList = require('../../../middlewares/RouteList.js').RouteList,
    routes = require('../../../config/routes.js')(require('path').basename(__dirname));


router.get(routes.base.path, function (req, res) {

    var rl = new RouteList(req.app);

    res.render('api/index', {
        routes: rl.retrieve()
    });
});

router.options(routes.base.path, function (req, res) {
    var rl = new RouteList(req.app);

    res.json(rl.retrieve());
});

module.exports = router;

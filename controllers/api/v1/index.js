/*jslint node: true */
'use strict';

var express = require('express'),
    router = express.Router(),

    routes = require('../../../config/routes.js')(require('path').basename(__dirname));

// TODO method with list of all endpoints in this API
router.get(routes.base.path, function (req, res) {

    res.json({});
});

module.exports = router;

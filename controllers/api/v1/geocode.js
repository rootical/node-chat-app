/*jslint node: true */
'use strict';

var express = require('express'),
    router = express.Router(),
    requestIp = require('request-ip'),

    routes = require('../../../config/routes.js')(require('path').basename(__dirname)),
    Geocode = require('../../../middlewares/Geocode.js').Geocode;

/**
 *
 * Get user location by longitude and latitude.
 * City and country are provided by Google Maps API.
 *
 */

console.log(routes.geocode.get.coordinates.path);

router.get(routes.geocode.get.coordinates.path, function (req, res) {

    var geo = new Geocode();

    geo.getByCoordinates(req.params.long, req.params.lat, function (err, data) {

        res.setHeader('Content-Type', 'application/json');

        if (err) {
            console.error(err);
            res.status(500).send(JSON.stringify({error: 'Something goes wrong with retrieving geolocation data'}, null, 2));
            return;
        }

        res.send(JSON.stringify(data, null, 2));
    });

});

/**
 *
 * Get user location by IP address.
 * City and coutnry are provided by freegeoip.net API.
 *
 */
router.get(routes.geocode.get.ip.path, function (req, res) {

    var geo = new Geocode(),
        ip = requestIp.getClientIp(req);

    geo.getByIp(ip, function (err, data) {

        res.setHeader('Content-Type', 'application/json');

        if (err) {
            res.status(500).send(JSON.stringify({error: 'Something goes wrong with retrieving geolocation data'}, null, 2));
            return;
        }

        res.send(JSON.stringify(data, null, 2));
    });
});

module.exports = router;

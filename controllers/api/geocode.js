/*jslint node: true */

var express = require('express'),
    router = express.Router(),
    requestIp = require('request-ip'),

    Geocode = require('../../middlewares/Geocode.js').Geocode;


router.get('/api/geocode/coordinates/:long/:lat', function (req, res) {
    'use strict';

    var geo = new Geocode();

    console.log(req.params);

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

router.get('/api/geocode/ip', function (req, res) {
    'use strict';

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

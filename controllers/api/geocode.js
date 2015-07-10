/*jslint node: true */

var express = require('express'),
    router = express.Router(),

    Geocode = require('../../middlewares/Geocode.js').Geocode;


router.get('/api/geocode/:long/:lat', function (req, res) {
    'use strict';

    var geo = new Geocode(req.params.long, req.params.lat);

    geo.getPlace(function (err, data) {

        res.setHeader('Content-Type', 'application/json');

        if(err) {
            res.status(500).send(JSON.stringify({error: 'Something goes wrong with retrieving geolocation data'}, null, 2));
            return;
        }


        res.send(JSON.stringify(data, null, 2));
    });

});

module.exports = router;

/*jslint node: true */

var http = require("http"),

    Geocode = function (long, lat) {
        'use strict';
    };

Geocode.prototype.getByIp = function (ip, callback) {
    'use strict';

    var url = 'http://freegeoip.net/json/' + ip;

    http.get(url, function (response) {

        var buffer = '',
            locData = {},
            data,
            route;

        response.on('data', function (chunk) {
            buffer += chunk;
        });

        response.on('end', function (err) {

            if (response.statusCode !== 200) {
                console.error(err);
                callback('Wrong response status: ' + response.statusCode);
                return;
            }

            try {
                data = JSON.parse(buffer);
            } catch (e) {
                callback(e);
                return;
            }

            var locData = {};

            locData.city = {
                longName: data.city,
                shortName: data.city
            };

            locData.country = {
                longName: data.country_name,
                shortName: data.country_code.toLowerCase()
            };

            callback(undefined, locData);
        });
    });
};

Geocode.prototype.getByCoordinates = function (longitude, latitude, callback) {
    'use strict';

    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';

    http.get(url, function (response) {

        var buffer = '',
            locData = {},
            data,
            route;

        response.on('data', function (chunk) {
            buffer += chunk;
        });

        response.on('end', function (err) {

            var ac, // addres components index in google api return
                location;

            try {
                data = JSON.parse(buffer);
            } catch (e) {
                callback(e);
                return;
            }

            if (data.status !== 'OK') {
                console.error(err);
                callback('Wrong response status: ' + data.status);
                return;
            }

            for (ac in data.results[0].address_components) {
                if (data.results[0].address_components.hasOwnProperty(ac)) {

                    location = data.results[0].address_components[ac];

                    if (location.types.indexOf('locality') > -1) {
                        locData.city = {
                            longName: location.long_name,
                            shortName: location.short_name
                        };
                    } else if (location.types.indexOf('country') > -1) {
                        locData.country = {
                            longName: location.long_name,
                            shortName: location.short_name.toLowerCase()
                        };
                    }
                }
            }

            callback(undefined, locData);
        });
    });

};

module.exports.Geocode = Geocode;

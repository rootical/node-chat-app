var http = require("http");


Geocode = function (long, lat) {
    'use strict';

    this.longitude = long;
    this.latitude = lat;


};

Geocode.prototype.getPlace = function (callback) {

    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.longitude + ',' + this.latitude + '&sensor=true';

    http.get(url, function (response) {

        var buffer = '',
            locData = {},
            data,
            route;

        response.on('data', function (chunk) {
            buffer += chunk;
        });

        response.on('end', function (err) {

            try {
                data = JSON.parse(buffer);
            } catch (e) {
                callback(e);
                return;
            }

            if(data.status !== 'OK') {
                var err = 'Wrong response status: ' + data.status;
                console.error(err)
                callback(err);
                return;
            }

            for(var ac in data.results[0].address_components) {

                var location = data.results[0].address_components[ac];

                if(location.types.indexOf('locality') > -1) {
                    locData.city = {
                        longName: location.long_name,
                        shortName:location.short_name
                    };
                } else if(location.types.indexOf('country') > -1) {
                    locData.country = {
                        longName: location.long_name,
                        shortName: location.short_name.toLowerCase()
                    };
                }
            }

            callback(undefined, locData);
        });
    });

};

module.exports.Geocode = Geocode;

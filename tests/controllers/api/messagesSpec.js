var rewire = require('rewire'),
    request = require('request'),
    helper = require('../../helper.js'),
    messages = rewire('../../../controllers/api/messages.js'),
    Message = messages.__get__('Message');


describe('API -> messages: ', function () {
    describe('GET:', function () {
        it('get messages should call getLastMessages and return object with or without data', function () {

            spyOn(Message, 'getLastMessages').andCallThrough();

            helper.withServer(function(r, done) {
                r.get('/api/messages', function (err, res, body) {

                    expect(Message.getLastMessages).toHaveBeenCalled();

                    expect(function () {
                        body = JSON.parse(body);
                    }).not.toThrow();

                    expect(Object.prototype.toString.call(body)).toBe('[object Array]');

                    //expect(body.length).toBeGreaterThan(0);

                    done();
                });
            });
        });
    });

    describe('DELETE:', function () {
        it('delete message', function () {

            spyOn(Message, 'getLastMessages').andCallThrough();

            helper.withServer(function(r, done) {
                r.get('/api/messages', function (err, res, body) {

                    expect(Message.getLastMessages).toHaveBeenCalled();

                    expect(function () {
                        body = JSON.parse(body);
                    }).not.toThrow();

                    expect(Object.prototype.toString.call(body)).toBe('[object Array]');

                    //expect(body.length).toBeGreaterThan(0);

                    done();
                });
            });
        });
    });
});

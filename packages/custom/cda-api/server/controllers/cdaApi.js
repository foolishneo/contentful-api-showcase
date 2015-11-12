'use strict';

var request = require('request');

exports.getAssets = function (req, res) {
    function constructUrl() {
        var host = 'https://cdn.contentful.com/spaces',
            args = {
                'space_id' : '57xft0hmd3wy',
                'access_token': '0b45bb25044141eb3c7e4cfc68eabeedc4af266f0a272102575697a4a304b3dd'
            },
            params = ('/' + args.space_id + '/assets?access_token=' + args.access_token);

        return host + params;
    }

    request(constructUrl(), function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.type('application/javascript');
            res.jsonp({
                'statusCode': 200,
                'items'     : JSON.parse(body).items
            });
        } else {
            res.status(500).send({ error: 'An error has occurred. Please contact the administrator' });
        }
    });
};

exports.resizeImage = function (req, res) {

    var args = {
        'base_url' : 'https://images.contentful.com/',
        'space_id' : 'cfexampleapi',
        'token1'   : '4gp6taAwW4CmSgumq2ekUm',
        'token2'   : '9da0cd1936871b8d72343e895a00d611',
        'name'     : 'Nyan_cat_250px_frame.png'
    }

    var url = args.base_url + args.space_id + '/' + args.token1 + '/' + args.token2 + '/' + args.name + '?w=' + req.query.w + '&h=' + req.query.h + '&r=' + req.query.r;

    if (req.query.f !== "undefined") {
        url += '&fit=' + req.query.f;
    }

    var params = {
        method: 'GET',
        url: url,
        encoding: null
    };

    request(params, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.type('png');
            var base64data = new Buffer(body, 'binary').toString('base64');
            res.end(base64data);
        } else {
            console.log('Error');
            res.status(500).send({ error: 'The request is invalid. Please check your parameters' });
        }
    });
};
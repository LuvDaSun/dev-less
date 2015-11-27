var path = require('path');
var express = require('express');
var lessCssHandler = require('../');
var basePath = path.join(__dirname, '..', 'test');

module.exports = function() {
    var app = express();

    app.get('*.css', lessCssHandler(basePath));

    return app;
};

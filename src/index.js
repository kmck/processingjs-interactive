'use strict';

var _ = require('lodash');
var ace = require('brace');
require('processing-js');
var Processing = window.Processing; // Woo, side-effects.
var app = window.app = require('./app');

module.exports = {
    _: _,
    ace: ace,
    Processing: Processing,
    app: app
};

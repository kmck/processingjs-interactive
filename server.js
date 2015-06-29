'use strict';

var express = require('express');

var app = express();
app.use(express.static(__dirname + '/public'));
app.get('*', function(req, res){
    res.status(404).send('Uhh...?');
});

var port = 8000;

console.log('Running on port', port);
app.listen(port);

module.exports = app;

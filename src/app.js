'use strict';

var _ = require('lodash');
var ace = require('brace');
require('processing-js');
var Processing = window.Processing; // Woo, side-effects.
require('brace/theme/monokai');

var demoScript = require('../examples/example1.txt') || '';

var ProcessingMode = require('../lib/mode-processing');

function startApp() {
    var processing;

    var previewEl = document.querySelector('.preview');
    var canvasEl = document.createElement('canvas');
    previewEl.appendChild(canvasEl);

    var editorEl = document.querySelector('.editor');
    var editor = ace.edit(editorEl);
    var session = editor.getSession();

    // Editor Config
    editor.$blockScrolling = Infinity;
    editor.setTheme('ace/theme/monokai');
    session.setMode(new ProcessingMode());
    editor.focus();

    var loadProcessing = function() {
        if (processing) {
            processing.exit();
        }
        try {
            processing = new Processing(canvasEl, editor.getValue());
            previewEl.classList.remove('errored');
        } catch(e) {
            previewEl.classList.add('errored');
        }
    };

    editor.on('change', _.debounce(loadProcessing, 500));

    editor.setValue(demoScript, 1);

    _.defer(loadProcessing);
}

window.initialize = startApp;

module.exports = startApp;

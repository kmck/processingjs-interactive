'use strict';

var ace = require('brace');
require('brace/mode/java');

var oop = ace.acequire('ace/lib/oop');
var TextMode = ace.acequire('ace/mode/text').Mode;
var ProcessingHighlightRules = require('./processing-highlight-rules');
var FoldMode = ace.acequire('ace/mode/folding/cstyle').FoldMode;

var Mode = function() {
    this.HighlightRules = ProcessingHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = '//';
    this.blockComment = {start: '/*', end: '*/'};
    this.$id = 'ace/mode/processing';
}).call(Mode.prototype);

module.exports = Mode;

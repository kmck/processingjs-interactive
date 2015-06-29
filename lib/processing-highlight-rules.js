'use strict';

var ace = require('brace');
require('brace/mode/java');

var oop = ace.acequire('ace/lib/oop');
var DocCommentHighlightRules = ace.acequire('ace/mode/doc_comment_highlight_rules').DocCommentHighlightRules;
var TextHighlightRules = ace.acequire('ace/mode/text_highlight_rules').TextHighlightRules;

var ProcessingHighlightRules = function() {

    var primitives = (
        'boolean|byte|char|color|double|float|int|long'
    );

    // taken from http://download.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
    var keywords = (
        'continue|for|new|switch|' +
        'default|boolean|if|private|' +
        'break|double|implements|throw|' +
        'byte|else|import|public|case|return|' +
        'throw|catch|extends|int|short|try|' +
        'char|final|static|void|' +
        'class|long|float|super|while'
    );

    var constants = (
        'width|height|HALF_PI|PI|QUARTER_PI|TAU|TWO_PI'
    );

    var langClasses = (
        'abs|acos|alpha|alpha|ambient|ambientLight|append|' +
        'applyMatrix|arc|asin|atan2|atan|background|beginCamera|' +
        'beginShape|bezier|bezierDetail|bezierPoint|bezierTangent|' +
        'bezierVertex|binary|blend|blend|blue|boolean|box|' +
        'brightness|byte|cache|camera|ceil|char|charAt|color|' +
        'colorMode|concat|constrain|contract|copy|copy|cos|' +
        'createFont|cursor|curve|curveDetail|curvePoint|' +
        'curveSegments|curveTightness|curveVertex|day|degrees|' +
        'delay|directionalLight|dist|duration|ellipse|ellipseMode|' +
        'emissive|endCamera|endShape|equals|exp|expand|fill|' +
        'filter|filter|float|floor|framerate|frustum|get|get|' +
        'green|hex|hint|hour|hue|image|imageMode|indexOf|int|join|' +
        'keyPressed|keyReleased|length|lerp|lightFalloff|' +
        'lightSpecular|lights|line|link|list|loadBytes|loadFont|' +
        'loadImage|loadPixels|loadSound|loadStrings|log|lookat|' +
        'loop|loop|mag|mask|max|millis|min|minute|modelX|modelY|' +
        'modelZ|month|mouseDragged|mouseMoved|mousePressed|' +
        'mouseReleased|nf|nfc|nfp|nfs|noCursor|noFill|noLoop|' +
        'noLoop|noSmooth|noStroke|noTint|noise|noiseDetail|' +
        'noiseSeed|normal|open|openStream|ortho|param|pause|' +
        'perspective|play|point|pointLight|popMatrix|pow|print|' +
        'printCamera|printMatrix|printProjection|println|' +
        'pushMatrix|quad|radians|random|randomSeed|rect|rectMode|' +
        'red|redraw|resetMatrix|reverse|rotate|rotateX|rotateY|' +
        'rotateZ|round|saturation|save|saveBytes|saveFrame|' +
        'saveStrings|scale|screenX|screenY|screenZ|second|set|' +
        'shininess|shorten|sin|size|smooth|sort|specular|sphere|' +
        'sphereDetail|splice|split|spotLight|sq|sqrt|status|stop|' +
        'str|stroke|strokeCap|strokeJoin|strokeWeight|subset|' +
        'substring|switch|tan|text|textAlign|textAscent|' +
        'textDescent|textFont|textLeading|textMode|textSize|' +
        'textWidth|texture|textureMode|time|tint|toLowerCase|' +
        'toUpperCase|translate|triangle|trim|unHint|unbinary|' +
        'unhex|updatePixels|vertex|volume|year|draw|setup'
    );

    var keywordMapper = this.createKeywordMapper({
        'variable.language': 'this',
        'keyword': keywords,
        'constant.language': constants,
        'support.function': langClasses
    }, 'identifier');

    var identifierRe = '[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*\\b';

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        'no_regex': [
            {
                token: 'comment',
                regex: '\\/\\/',
                next: 'line_comment'
            },
            DocCommentHighlightRules.getStartRule('doc-start'),
            {
                token: 'comment', // multi line comment
                regex: /\/\*/,
                next: 'comment'
            }, {
                token: 'string',
                regex: '\'(?=.)',
                next: 'qstring'
            }, {
                token: 'string',
                regex: '\'(?=.)',
                next: 'qqstring'
            }, {
                token: 'constant.numeric', // hex
                regex: /0[xX][0-9a-fA-F]+\b/
            }, {
                token: 'constant.numeric', // float
                regex: /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
            }, {
                // function myFunc(arg) { }
                token: [
                    'storage.type', 'text', 'text', 'entity.name.function', 'text', 'paren.lparen'
                ],
                regex: '(void|' + primitives + ')(\\[\\])?(\\s+)(' + identifierRe + ')(\\s*)(\\()',
                next: 'function_arguments'
            }, {
                token: ['support.constant'],
                regex: /that\b/
            }, {
                token: keywordMapper,
                regex: identifierRe
            }, {
                token: 'keyword.operator',
                regex: /--|\+\+|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|[!$%&*+\-~\/^]=?/,
                next: 'start'
            }, {
                token: 'punctuation.operator',
                regex: /[?:,;.]/,
                next: 'start'
            }, {
                token: 'paren.lparen',
                regex: /[\[({]/,
                next: 'start'
            }, {
                token: 'paren.rparen',
                regex: /[\])}]/
            }, {
                token: 'comment',
                regex: /^#!.*$/
            }
        ],
        'start': [
            {
                token: 'comment',
                regex: '\\/\\/.*$'
            },
            DocCommentHighlightRules.getStartRule('doc-start'),
            {
                token: 'comment', // multi line comment
                regex: '\\/\\*[\\s\\S]*\\*\\/',
                next: 'comment'
            }, {
                token: 'string', // single line
                regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token: 'string', // single line
                regex: '[\'](?:(?:\\\\.)|(?:[^\'\\\\]))*?[\']'
            }, {
                token: 'constant.numeric', // hex
                regex: '0[xX][0-9a-fA-F]+\\b'
            }, {
                token: 'constant.numeric', // float
                regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b'
            }, {
                token: 'constant.language.boolean',
                regex: '(?:true|false)\\b'
            }, {
                // function myFunc(arg) { }
                token: [
                    'storage.type', 'text', 'text', 'entity.name.function', 'text', 'paren.lparen'
                ],
                regex: '(void|' + primitives + ')(\\[\\])?(\\s+)(' + identifierRe + ')(\\s*)(\\()',
                next: 'function_arguments'
            }, {
                token: 'storage.type',
                regex: '(void|' + primitives + ')'
            }, {
                token: keywordMapper,
                // TODO: Unicode escape sequences
                // TODO: Unicode identifiers
                regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b'
            }, {
                token: 'keyword.operator',
                regex: '!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)'
            }, {
                token: 'lparen',
                regex: '[[({]'
            }, {
                token: 'rparen',
                regex: '[\\])}]'
            }, {
                token: 'text',
                regex: '\\s+'
            }
        ],
        'comment': [
            {
                token: 'comment', // closing comment
                regex: '.*?\\*\\/',
                next: 'start'
            }, {
                token: 'comment', // comment spanning whole line
                regex: '.+'
            }
        ],
        'function_arguments': [
            {
                token: 'variable.parameter',
                regex: identifierRe
            }, {
                token: 'punctuation.operator',
                regex: '[, ]+'
            }, {
                token: 'punctuation.operator',
                regex: '$'
            }, {
                token: 'empty',
                regex: '',
                next: 'no_regex'
            }
        ]
    };

    this.embedRules(DocCommentHighlightRules, 'doc-',
        [ DocCommentHighlightRules.getEndRule('start') ]);
};

ProcessingHighlightRules.metaData = {
    fileTypes: [ 'pde' ],
    name: 'Processing',
    scopeName: 'source.processing'
};


oop.inherits(ProcessingHighlightRules, TextHighlightRules);

module.exports = ProcessingHighlightRules;

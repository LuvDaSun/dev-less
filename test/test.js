/* jshint undef: false  */

var when = require('when');
var when_node = require('when/node');
var rest = require('rest');
var fs = require('fs');
var less = require('less');
var path = require('path');

var when_readFile = when_node.lift(fs.readFile.bind(fs));
var when_render = when_node.lift(less.render.bind(less));


describe('test', function() {

    var server = useServer();

    testFile('tester');

    function testFile(name) {

        it('test ' + name, function() {

            return when_readFile(path.join(__dirname, name + '.less')).
            then(function(content) {
                return when_render(content.toString()).
                then(function(output) {
                    return output.css;
                }).
                then(stripComments);
            }).
            then(function(css) {
                return rest(server.url + '/' + name + '.css').
                then(function(response) {
                    return response.entity;
                }).
                then(stripComments).
                should.eventually.equal(css);
            });

        });

    }

});


function stripComments(contents) {
    return contents.replace(/\/\*[\s\S]*\*\//g, '');
}


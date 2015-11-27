/* eslint no-undef:0 */

var os = require('os');
var Server = require('./server');

global.useServer = function useServer() {

    var info = {};
    var server = Server({});
    var listener;
    var socketID = 0;
    var socketPool = {};

    before('start server', function(done) {
        listener = server.listen(done);
        listener.on('connection', function(socket) {
            socketID++;
            socketPool[socketID] = socket;
            socket.on('close', function() {
                delete socketPool[socketID];
            });
        });
    });

    before('load info', function() {
        info.address = listener.address();
        info.url = 'http://' + os.hostname() + ':' + info.address.port;
    });

    after('stop server', function(done) {
        listener.close(done);
        for (socketID in socketPool) {
            socketPool[socketID].destroy();
        }
    });

    return info;
};

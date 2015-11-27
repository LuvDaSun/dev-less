var path = require('path');
var fs = require('fs');
var less = require('less');


module.exports = function(basePath, options) {
    options = Object.assign({
        plugins: [],
        extname: ".less"
    }, options);


    return function lessCssHandler(req, res, next) {
        var moduleId = path.join(path.dirname(req.path), path.basename(req.path, path.extname(req.path))).substr(1);
        var srcPath = path.join(basePath, moduleId + options.extname);

        statFileOrNull(srcPath, function cb(err, stat) {
            if (err) return next(err);
            if (!stat) return next();

            res.set("Cache-Control", "public, max-age=0");
            res.set("Last-Modified", stat.mtime);
            res.set('Content-Type', 'text/css');

            renderLessFile(srcPath, options, function cb(err, result) {
                if (err) return next(err);

                res.end(result.css);
            });
        });

    };

};


function statFileOrNull(srcPath, cb) {
    fs.stat(srcPath, function(err, stat) {
        if (err) {
            if (err.code === 'ENOENT') return cb(null, null);
            return cb(err);
        }
        if (!stat.isFile()) return cb(null, null);

        cb(null, stat);
    });
}


function renderLessFile(srcPath, options, cb) {
    fs.readFile(srcPath, function cb(err, content) {
        if (err) return cb(err);

        less.render(content.toString(), {
            filename: srcPath,
            sourceMap: {
                sourceMapFileInline: true
            },
            plugins: options.plugins
        }, cb);
    });
}

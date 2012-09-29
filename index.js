#!/usr/bin/env node

var fs    = require('fs')
;

module.exports = function walk(_basedir, _cb) {
  var pending = 0;
  var paths   = {};
  //var dirs    = [];
  //var files   = [];

  _walk(_basedir, _cb);

  function trim(path) {
    if (path.indexOf(_basedir) === 0) {
      path = path.substr(_basedir.length);
      path = path.replace(/^[/]/, '');
    }
    return path;
  }

  function _walk(basedir, cb) {
    var trimmed = trim(basedir);
    //dirs.push(trimmed);
    paths[trimmed] = 'd';

    pending++;
    fs.readdir(basedir, function(err, files){
      pending--;

      if (err) return cb(err);

      files.forEach(function(file){
        var full = [basedir, file].join('/');

        pending++;
        fs.stat(full, function(err, stat){
          pending--;

          if (err) {
            if (err.code !== 'ENOENT') {
              return cb(err);
            } else {
              return;
            }
          }

          if (stat.isDirectory()){
            _walk(full, cb);
          } else {
            paths[trim(full)] = 'f';
            //files.push(file);
          }

          if (pending === 0) _cb(err, paths);
        });
      })
      if (pending === 0) _cb(err, paths);
    });
  }
};

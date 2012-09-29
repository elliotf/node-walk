#!/usr/bin/env node

var walk = require('../')
  , path = require('path')
;

var toWalk = process.argv.slice(2);
if (!toWalk.length) toWalk = ['/usr/local/'];

toWalk.forEach(function(basedir){
  walk(basedir, function(err, paths){
    if (err) return console.log("GOT AN ERR: ", err);

    var files = Object.keys(paths);
    var types = {
        d: 'directory'
      , f: 'file'
    }

    files.sort().forEach(function(p){
      console.log(path.join(basedir, p) + " is a " + types[paths[p]]);
    });
  });
});

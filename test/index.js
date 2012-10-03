var chai    = require('chai')
    should  = chai.should()
    mkdirp  = require('mkdirp')
    async   = require('async')
    walk    = require('../')
;

chai.Assertion.includeStack = true;

describe("walk", function() {
  var base;

  beforeEach(function(done) {
    base = __dirname + '/fixtures/';

    async.parallel([
        function(cb){ mkdirp(base + 'sub/sub_sub', cb); }
      , function(cb){ mkdirp(base + 'sub2',        cb); }
    ], done);
  });

  describe("when given an invalid base path", function() {
    it("returns an err and no paths", function(done) {
      walk(base + 'does_not_exist', function(err, paths){
        should.exist(err);
        should.not.exist(paths);
        done();
      });
    });
  });

  describe("when walking directories", function() {
    it("returns the basepath", function(done) {
      walk(base + 'sub/sub_sub', function(err, paths){
        should.not.exist(err);
        paths.should.deep.equal({
          '': 'd'
        });
        done();
      });
    });

    it("returns sub paths found", function(done) {
      walk(base + 'sub', function(err, paths){
        should.not.exist(err);
        paths.should.have.keys(
          [
            '', 'sub_sub'
          ]
        );

        paths.should.deep.equal({
          '': 'd'
          , 'sub_sub': 'd'
        })

        done();
      });
    });

    it("returns sub sub paths found", function(done) {
      walk(base, function(err, paths){
        should.not.exist(err);
        paths.should.have.keys(
          [
            '', 'sub', 'sub2', 'sub3', 'sub/sub_sub'
          ]
        );

        paths.should.deep.equal({
          '': 'd'
          , 'sub': 'd'
          , 'sub2': 'd'
          , 'sub3': 'f'
          , 'sub/sub_sub': 'd'
        })
        done();
      });
    });

    xit("does it all", function(done) {
      walk(base, function(err, paths){
        should.not.exist(err);
        paths.should.have.keys(
          [
            '', 'sub', 'sub2', 'sub3', 'sub/sub_sub'
          ]
        );
        paths.should.deep.equal({
          ''          : 'd'
          , 'sub' : 'd'
          , 'sub2': 'd'
          , 'sub3': 'f'
          , 'sub/sub_sub': 'd'
        })
        done();
      });
    });
  });
});

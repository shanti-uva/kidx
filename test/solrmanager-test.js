/**
 * Created by ys2n on 7/18/14.
 */

var sm = require("../connectors/solrmanager");
var solr = require("solr-client");
var mb = require("../connectors/mediabase");
var ss = require("../connectors/sharedshelf");
var async = require("async");

const DATA = ["subjects-1300", "places-13656", "subjects-6662", 'places-15401', 'places-13656', "subjects-5956",
    "subjects-6033", "places-1158", "places-1078", "places-1169", "subjects-5956", "places-637", "places-15355",
    'subjects-2823'];


exports.testLastUpdated = function(test) {

    sm.lastUpdated("mediabase-168", function(err,timestamp) {
            console.log("last checked: " + timestamp);
            console.log(new Date().getTime());
            test.done();
        }
    );

}





if (true)
exports.addDocsTestSS = function (test) {

    const CONCURRENCY = 2;
    var q = async.queue(
        function (kmapid, callback){
            ss.getDocumentsByKmapId(kmapid,
                function (err, docs) {
                    sm.addDocs(docs,callback);
                    test.ok(true);
                    console.log("ADDED: " + JSON.stringify(docs,undefined,2));
                })
        }, CONCURRENCY);


    q.drain = function() { test.done(); };


    q.push(DATA);

};






if (false)
exports.addDocsTestMB = function (test) {

    const CONCURRENCY = 2;
    var q = async.queue(
        function (kmapid, callback){
            mb.getDocumentsByKmapId(kmapid,
                function (err, docs) {
                    sm.addDocs(docs,callback);
                    test.ok(true);
                    console.log("ADDED: " + JSON.stringify(docs,undefined,2));
                })
        }, CONCURRENCY);


    q.drain = function() { test.done(); };

    q.push(DATA);

};

if (false)
exports.addDocsTest2 = function (test) {

    test.expect(2);

    async.series([

        function (cb) {
            mb.getDocumentsByKmapId('places-15401',
                function (err, docs) {
                    sm.addDocs(docs,cb);
                    test.ok(true);
                    console.log("ADDED: " + JSON.stringify(docs,undefined,2));
                });
        },
        function (cb) {
            ss.getDocumentsByKmapId('places-13656',
                function (err, docs) {
                    sm.addDocs(docs,cb);
                    test.ok(true);
                    console.log("ADDED: " + JSON.stringify(docs,undefined,2));

                });
        }
    ],
        function (err, res) {
            if (err) {
                throw err
            } else {
                console.dir(res);
            }
            test.done();
        });


}



if (false)
exports.checkIndexCounts = function (test) {
    // After the above tests ran,  make sure the counts coming out of the index look ok!


}





/**
 * Created by ys2n on 7/1/14.
 */

var kmapid_fixtures = [
    { id: "subjects-1300", doc_count: 2 }, // Subject "Mindfulness Meditation"
    { id: "places-13656", doc_count: 7 }, // Place "United States of America"
    { id: "subjects-6662", doc_count: 1 } // Subject "Darden Business School"
];

var doc_fixtures = [
    { id: 2652867, kmapid_count: 2 },
    { id: 2652877, kmapid_count: 2 },
    { id: 2652876, kmapid_count: 1 },
    { id: 2652875, kmapid_count: 1 },
    { id: 2652874, kmapid_count: 1 },
    { id: 2652873, kmapid_count: 1 },
    { id: 2652872, kmapid_count: 1 },
    { id: 2652871, kmapid_count: 1 }
]

var ss = require("../connectors/sharedshelf");
var async = require("async");

const STALE_TIME= 60*1000; //

kmapid_fixtures.forEach (
    function (fix) {
        exports["getDocumentsByKmapIdStale-" + fix.id] = function(test) {
            test.expect(1);
            ss.getDocumentsByKmapIdStale(fix.id, STALE_TIME, function(err,list) {
                console.log("result:" + JSON.stringify(list,undefined,3));
                test.equals(fix.doc_count, list.length);
                test.done();
            });
        }
    }
)

kmapid_fixtures.forEach (
    function (fix) {
        exports["getDocumentsByKmapId-" + fix.id] = function(test) {
            test.expect(1);
            ss.getDocumentsByKmapId(fix.id,function(err,list) {
                console.log("result:" + JSON.stringify(list,undefined,3));
                test.equals(fix.doc_count, list.length);
                test.done();
            });
        }
    }
)



// assemble tests
if(true)
    kmapid_fixtures.forEach ( function(kmapfix) {
            exports["getItemIdListFromKMapId-" + kmapfix.id] = function (test) {
            test.expect(1);
            ss.getItemIdList(kmapfix.id, function (err, idlist) {
                    // console.log("Itemid list: " + JSON.stringify(idlist));
                    test.equals(idlist.length, kmapfix.doc_count, "Item Id count is unexpected.");
                    test.done();
                }
            );
        };
    });

// test
if (true)
    doc_fixtures.forEach ( function(fixdoc) {
        exports["getDocument-" + fixdoc.id] = function(test) {
            test.expect(1);
            ss.getDocument(fixdoc.id, function (err, doc) {
                console.log("doc.kmapid: " + JSON.stringify(doc.kmapid, undefined, 2));
                var count = (doc.kmapid)?doc.kmapid.length:0;
                test.equals(count, fixdoc.kmapid_count, "kmapid counts are off");
                test.done();
            })
        }
    });

if (true)
doc_fixtures.forEach( function (fix) {
    exports["full-crosscheck-" + fix.id] = function(test) {
        async.waterfall([
            function(cb) {
                ss.getDocument(fix.id,cb);
            }
        ],

        // final function in waterfall
        function(err,doc) {

            // console.log("CROSS:  " + JSON.stringify(doc,undefined,3));

            test.expect(doc.kmapid.length + 1);

            // call getItemIdList and verify that this document is listed in each.

            console.log("kmapids returned from doc " + JSON.stringify(doc.kmapid));

            async.every(doc.kmapid,
                function(kid,cb) {
                    ss.getItemIdList(kid, function(err, list) {
                            var found = false;
                            list.forEach(function(x) {
                                if (x === doc.id) found = true;;
                            })
                            test.ok(found, "WARNING: doc id " + doc.id + " wasn't found in lookup for kmapid " + kid + " even though the document lists that kmapid");
                            cb(found);
                        }
                    );
                },

                function(allOK){
                    // finally
                    console.log("ret:" + allOK);
                    test.ok(allOK);
                    test.done();
                })
        });

    }
});

// test uses https://github.com/caolan/async#waterfall
doc_fixtures.forEach( function (docfix) {
    exports["crosscheck-" + docfix.id] = function(test) {
        test.expect(1);
        async.waterfall([
            function(callback) {
                // get document
                ss.getDocument(docfix.id,callback);
            },
            function(doc, callback) {
                // get the list of document ids for the first kmapid
                console.log(JSON.stringify(doc,undefined,3));
                ss.getItemIdList(doc.kmapid[0],callback);
            }
        ], function(err,result) {
            // verify that kmapid exists in the list
//                console.log("ZOWIE: " + result.indexOf(fix.id) + " --- " + JSON.stringify(result));
            console.log("got " + result.length + " ids");
            test.ok((result.length === 0 || result.indexOf(docfix.id) > -1), "Cross check failed!");
            test.done();
        })
    }
});


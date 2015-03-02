/**
 * Created by ys2n on 7/1/14.
 */


const TEST_LEVEL = 3;

var kmapid_fixtures = [
    { id: "subjects-652" , count: 853 },
    { id: "places-15400" , count: 92 },
    { id: "places-15352", count: 77 },
    { id: "subjects-2823", count: 1751 },
    { id: "subjects-6034", count: 84 },
    { id: "subjects-6060", count: 279 },
    { id: "subjects-5956", count: 12 },
    { id: "subjects-6033", count: 23 },
    { id: "places-1158", count: 3 },
    { id: "places-1078", count: 2 },
    { id: "places-1169", count: 4 },
    { id: "places-15401", count: 12 },
    { id: "places-637", count: 249 },
    { id: "places-15355", count: 267 }
];

var doc_fixtures = [
    { id: 2025, count: 0 },
    { id: 118, count: 9},
    { id: 201, count: 9 },
    { id: 27, count: 7 },
    { id: 524, count: 8 },
    { id: 345, count: 10 },
    { id: 123, count: 9 },
    { id: 1244, count: 0 },
    { id: 543, count: 15 },
    { id: 110, count: 8 },
    { id: 1907, count: 1 },
    { id: 2013, count: 14 },
    { id: "/oijoij/",  count: 0 }
]

var mb = require("../connectors/mediabase");
var async = require("async");
var _ = require("underscore");

if(TEST_LEVEL >= 3)
    kmapid_fixtures.forEach ( function(kmapfix) {
            exports["getItemIdListFromKMapId-" + kmapfix.id] = function (test) {
            test.expect(1);
            mb.getItemIdList(kmapfix.id, function (err, idlist) {
                    console.log("Itemid list: " + JSON.stringify(idlist));
                    test.equals(idlist.length, kmapfix.count, "Item Id count is unexpected.");
                    test.done();
                }
            );
        };
    });

// test
if (TEST_LEVEL >= 3)
    doc_fixtures.forEach ( function(fixdoc) {
        exports["getDocument-" + fixdoc.id] = function(test) {
            test.expect(1);
            mb.getDocument(fixdoc.id, function (err, doc) {
                console.log("HOHOHO: " + JSON.stringify(doc));
                console.log("doc.kmapid: " + JSON.stringify(doc.kmapid));
                test.equals(doc.kmapid.length, fixdoc.count, "kmapid counts are off.  Should be: { id: " + fixdoc.id + ", count: " + doc.kmapid.length + " }");
                console.log("===== HERE'S THE DOC =====");
                console.log(JSON.stringify(doc,undefined,3));
                console.log("===== HERE ENDETH THE DOC =====");
                test.done();
            })
        }
    });

if (TEST_LEVEL >= 3)
doc_fixtures.forEach( function (fix) {
    exports["full-crosscheck-" + fix.id] = function(test) {
        async.waterfall([
            function(cb) {
                mb.getDocument(fix.id,cb);
            }
        ],

        // final function in waterfall
        function(err,doc) {
            test.expect(doc.kmapid.length + 1);

            // call getItemIdList and verify that this document is listed in each.
            async.every(doc.kmapid,
                function(kid,cb) {
                    mb.getItemIdList(kid, function(err, list) {
                            var found = false;
                            list.forEach(function(x) {
                                if (Number(x) === Number(doc.id)) { found = true; };
                            })
                            if (!found) {
                                console.log("WARNING: doc id " + doc.id + " wasn't found in lookup for kmapid " + kid + " even though the document lists that kmapid");
                            }
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
if (TEST_LEVEL >= 3)
doc_fixtures.forEach( function (fix) {
    exports["crosscheck-" + fix.id] = function(test) {
        test.expect(1);
        async.waterfall([
            function(callback) {
                // get document
                mb.getDocument(fix.id,callback);
            },
            function(doc, callback) {
                // get the list of document ids for the first kmapid

                var kid = doc.kmapid[0]; // checking the first kmapid;

                if (kid) {
                    mb.getItemIdList(kid,callback);
                }

                else {
                    callback(null, []);
                }
            }

        ], function(err,result) {
            // verify that kmapid exists in the list
//                console.log("ZOWIE: " + result.indexOf(fix.id) + " --- " + JSON.stringify(result));

            test.ok(err != null);

            console.dir(result);
            test.ok((result) && (!result.error) && (result.length === 0 || result.indexOf(fix.id) > -1), "Cross check failed!");
            test.done();
        })
    }
});



if (TEST_LEVEL >= 3)
kmapid_fixtures.forEach (
    function (fix) {
        exports["getDocumentsByKmapId-" + fix.id] = function(test) {
            test.expect(1);
            mb.getDocumentsByKmapId(fix.id,function(err,list) {
                console.log("result:" + JSON.stringify(list, undefined, 3));
                test.equals(list.length,fix.count);
                test.done();
            });
        }
    }
);


exports["getDocumentdByDocIds"] = function(test) {
    var doclist=[];
    doc_fixtures.forEach( function(x) {
        doclist.push(x.id);
    })

    console.log("Trying:  " + doclist);
    test.expect(1);
    mb.getDocumentsByDocIds(doclist,function(err,list) {
        console.log("result:" + JSON.stringify(list, undefined, 3));
        test.equals(list.length,doc_fixtures.length);
        test.done();
    });



};

exports["getDocumentdByDocIdsByRange"] = function(test) {
    var doclist=_.range(1000,1010);
    console.log("Trying:  " + doclist);
    test.expect();
    mb.getDocumentsByDocIds(doclist,function(err,list) {
        console.log("result:" + JSON.stringify(list, undefined, 3));
        test.done();
    });
}

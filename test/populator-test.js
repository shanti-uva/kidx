/**
 * Created by ys2n on 7/16/14.
 */

kmapid_fixtures = [
    { type: "subjects", id: "subjects-6403", name: "Tibet and Himalayas" },
    { type: "subjects", id: "subjects-2328", name: "By pupose to be achieved" },
//    { type: "subjects", id: "subjects-6034", name: "History of Central Tibet" },
//    { type: "subjects", id: "subjects-6060", name: "Lhasa" },
//    { type: "subjects", id: "subjects-5956", name: "Academic Lectures in Tibetan" },
//    { type: "subjects", id: "subjects-593", name: "Bodish" },
    { type: "places", id: "places-13656", name: "United States of America" },
    { type: "places", id: "places-2", name: "Tibet Autonomous Region" }
]

docuid_fixtures = [
    { uid: "mediabase-524"},
  //  { uid: "sharedshelf-2652877" },
    { uid: "mediabase-2036" }
];

var populator = require("../tasks/populator");
var populateIndexByKMapId = populator.populateIndexByKMapId;
var mb = require("../connectors/mediabase");

const STALE_TIME = 20 * 1000 // 100 seconds;

if(false) {
    docuid_fixtures.forEach (
        function(x) {
            exports["testDocumentCheck-" + x.uid] = function(test) {
                test.expect(1);
                populator.documentStale(x.uid, STALE_TIME, function(err,notStale) {
                    if (notStale) {
                        console.log("Document is not stale");
                    } else {
                        console.log("Document is stale");
                    }

                    test.ok(!notStale);
                    test.done();
                })
            }
        }
    );
}

if(false) {
    docuid_fixtures.forEach (
        function(x) {
            exports["testPopulateDocument-" + x.uid] = function(test) {
                test.expect(1);
                populator.populateIndexByServiceId(mb, x.uid, function(err,ret) {

                    console.log("Err = " + err);
                    console.log("Ret = " + ret);

                    test.ok(ret !== null);
                    test.done();
                })
            }
        }
    );
}





if(false) {
    kmapid_fixtures.forEach(
        function(x) {
            exports["testPopulateIndexByKMapIdStale-" + x.id] = function(test) {
                test.expect(1);
                populator.populateIndexByKMapIdStale(x.id, STALE_TIME, function(err,ret) {
                    if (err) {
                        console.log("ERROR:" + err);
                    }
                    console.log("RETURN: " + ret);
                    test.ok(!err);
                    test.done();
                });
            }
        }
    );
}


if(false) {
    kmapid_fixtures.forEach(
          function(x) {
            exports["testPopulateIndexByKMapId-" + x.id] = function(test) {
                test.expect(1);
                populateIndexByKMapId(x.id, function(err,ret) {
                   if (err) {
                       console.log("ERROR:" + err);
                   }
                   console.log("RETURN: " + ret);
                   test.ok(!err);
                   test.done();
                });
            }
        }
    );
}

if(false) {
    kmapid_fixtures.forEach(
        function(x) {
            exports["testRePopulateIndexByKMapIdStale-" + x.id] = function(test) {
                test.expect(1);
                populator.populateIndexByKMapIdStale(x.id, STALE_TIME, function(err,ret) {
                    if (err) {
                        console.log("ERROR:" + err);
                    }
                    console.log("RETURN: " + ret);
                    test.ok(!err);
                    test.done();
                });
            }
        }
    );
}



if(false)
kmapid_fixtures.forEach(
    function(x) {
        exports["testGetDocumentsByKMapId- " + x.id] = function(test) {
            test.expect(1);
            populator.getDocumentsByKMapId(x.id,
                function(err,docs) {
                    console.log(err);
                    console.log("=========================");
                    console.log(JSON.stringify(docs,undefined,3));
                    console.log("=========================");
                    test.ok(true);
                    test.done();
                }
            )
        }
    }
)

if(false)
exports["rangePopulateMediaBase"] = function(test) {
    var mb = require("../connectors/mediabase");
    test.expect(1);
    populator.rangePopulateIndexByService(mb,1,2160,function(err,ret) {
        console.log("Err = " + err);
        console.log("Ret = " + ret);
        test.ok(true);
        test.done();
    })

}


if(false)
exports["missing pdid"] = function (test) {
    var mb = require("../connectors/mediabase");

    populator.populateIndexByServiceId(mb, 2036, function( err, ret) {
        console.log("The Error = " + err);
        console.log("The Return = " + JSON.stringify(ret));
        test.ok(err === null);
        test.ok(ret !== null);
        test.done();
    });


}

if(false) {
    docuid_fixtures.forEach (
        function(x) {
            exports["reTestDocumentCheck-" + x.uid] = function(test) {
                test.expect(1);
                populator.documentStale(x.uid, STALE_TIME, function(err,notStale) {
                    if (notStale) {
                        console.log("Document is not stale");
                    } else {
                        console.log("Document is stale");
                    }
                    test.ok(notStale);
                    test.done();
                })
            }
        }
    );
}


if(false)
    exports["non-existent resource"] = function (test) {
        var mb = require("../connectors/mediabase");
        test.expect(2);
        populator.populateIndexByServiceId(mb, 9999999, function( err, ret) {
            console.log("The Error = " + err);
            console.log("The Return = " + JSON.stringify(ret));
            test.ok(err === null);
            test.ok(ret !== null);
            test.done();
        });
    }



if (false)
exports["harvest subjects"] = function(test) {

    test.expect(2);
    populator.populateTermIndex(
        "subjects.kmaps.virginia.edu",
        function(err,ret) {
        console.log("The Error = " + err);
        console.log("The Return = " + ret.length + " items");
        test.ok(err === null);
        test.ok(ret !== null);
        test.done();
    });

}

if (true)
    exports["harvest places"] = function(test) {

        test.expect(2);
        populator.populateTermIndex(
            "places.kmaps.virginia.edu",
            function(err,ret) {
                console.log("The Error = " + err);
                console.log("The Return = " + ret.length + " items");
                test.ok(err === null);
                test.ok(ret !== null);
                test.done();
            });

    }
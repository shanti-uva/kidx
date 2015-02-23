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

if(true) {
    docuid_fixtures.forEach (
        function(x) {
            exports["testPopulateMediabaseDocument-" + x.uid] = function(test) {
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


if (false)
exports["eliminateOldEntries"] = function(test) {
    var mb = require("../connectors/mediabase");
    test.expect(1);
    populator.updateEntries("mediabase_drupal-dev_shanti_virginia_edu", mb, function(err,ret) {
        console.log("Err = " + err);
        console.log("Ret = " + ret);
        test.ok(true);
        test.done();
    })
}

if(false)
exports["rangePopulateMediaBase"] = function(test) {
    var mb = require("../connectors/mediabase");
    test.expect(1);
    populator.rangePopulateIndexByService(mb,1 ,2600,function(err,ret) {
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


exports['getTermCheckSum'] = function(test) {
    test.expect(1);
    populator.getTermCheckSum("subjects-3824", function(err,ck) {
        console.log("CHECKSUM = " + ck);
        test.ok(ck[0] === "378ff9672cd89d9a6b4f4a3bc19257dd61447c34");
        test.done();
    });
}

exports['getTermCheckSum-2'] = function(test) {
    test.expect(1);
    populator.getTermCheckSum("places-5229", function(err,ck) {
        console.log("CHECKSUM = " + ck);
        test.ok(ck[0] === "2b38c06dc6d442606494f50f087f8a0374868c2e");
        test.done();
    });
}

if (true)
    exports["harvest places"] = function(test) {

        process.on('uncaughtException', function (er) {
            console.trace("UnCaught exception!");
            console.error(er.stack)
            process.exit(1)
        })

        test.expect(2);
        populator.populateTermIndex(
            "places.kmaps.virginia.edu",
            function(err,ret) {
                console.log("The Error = " + err);
                console.log("The Return = " + ret.length + " items");
                test.ok(!err);
                test.ok(ret !== null);
                test.done();
            });

    }


if (true)
    exports["harvest subjects"] = function(test) {

        test.expect(2);
        populator.populateTermIndex(
            "subjects.kmaps.virginia.edu",
            function(err,ret) {
                console.log("The Error = " + err);
                if (err) {
                    console.log("The stack = " + err.stack);
                }
                console.log("The Return = " + ret.length + " items");
                test.ok(!err);
                test.ok(ret !== null);
                test.done();
            });

    }
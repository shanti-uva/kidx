/**
 * Created by ys2n on 8/7/14.
 */


var kmapid_fixtures = [
    { id: "places-5229", count: 99 },
    { id: "places-1080", count: 99 },
    { id: "places-15909", count: 99 },
    { id: "places-2", count: 1 },
    { id: "places-1", count: 2},
    { id: "places-15400" , count: 93 },
    { id: "places-15352", count: 77 },
    { id: "subjects-2823", count: 1752 },
    { id: "subjects-6034", count: 84 },
    { id: "subjects-6060", count: 279 },
    { id: "subjects-5956", count: 12 },
    { id: "subjects-6033", count: 23 },
    { id: "places-1158", count: 3 },
    { id: "places-1078", count: 3 },
    { id: "places-1169", count: 4 },
    { id: "places-15401", count: 12 },
    { id: "places-637", count: 249 },
    { id: "places-15355", count: 267 }
];

var km = require('../connectors/kmaps');
var sm = require('../connectors/solrmanager');

if(true) {
    kmapid_fixtures.forEach ( function(kmapfix) {
        exports["getKmapsDocument-" + kmapfix.id] = function (test) {
            test.expect(1);
            km.getKmapsDocument(kmapfix.id, function (err, doc) {
                    console.log("KmapsDoc: " + JSON.stringify(doc,undefined,2));
                    test.ok(doc !== null);
                    test.done();
                }
            );
        };
    });
}

if (true) {
    exports["testGetKmapsTree"] = function(test) {
        test.expect(1);
        km.getKmapsTree("subjects.kmaps.virginia.edu", function(err,ret) {
            console.log("ERR: " + err);
            console.log("RET: " + ret);
            test.ok(ret !== null);
            test.done();
        })
    }
}


if (true) {
    exports["testGetKmapsList"] = function(test) {
        test.expect(2);
        km.getKmapsList("subjects.kmaps.virginia.edu", function(err,ret) {
            console.log("ERR: " + err);
            console.log("RET: " + ret);
            test.ok(ret !== null);
            test.ok(ret.length != 0);
            test.done();
        })
    }
}

if(true) {
    kmapid_fixtures.forEach ( function(kmapfix) {
        exports["write test: " + kmapfix.id] = function (test) {
            test.expect(1);
            km.getKmapsDocument(kmapfix.id, function (err, doc) {
                    console.log("KmapsDoc: " + JSON.stringify(doc,undefined,2));
                    sm.addTerms([ doc ],function(err, status) {
                        console.dir(status);
                        test.ok(!err);
                        test.done();
                    })
                }
            );
        };
    });
}
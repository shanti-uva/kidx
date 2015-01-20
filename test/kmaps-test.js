/**
 * Created by ys2n on 8/7/14.
 */


var kmapid_fixtures = [
    { id: "subjects-29", count: 2000000 },
    { id: "subjects-104", count: 2000000 },
    { id: "subjects-105", count: 2000000 },
    { id: "subjects-106", count: 2000000 },
    { id: "subjects-107", count: 2000000 },
    { id: "subjects-109", count: 2000000 },
    { id: "subjects-110", count: 2000000 },
    { id: "subjects-353", count: 2000000 },
    { id: "subjects-2300", count: 100101010 },
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
    { id: "places-15355", count: 267 },
    {
        "id": "places-8367"
    },
    {
        "id": "places-8430"
    },
    {
        "id": "places-17494"
    },
    {
        "id": "places-1"
    },
    {
        "id": "places-17837"
    },
    {
        "id": "places-3218"
    },
    {
        "id": "places-2530"
    },
    {
        "id": "places-761"
    },
    {
        "id": "places-15716"
    },
    {
        "id": "places-16030"
    },
    {
        "id": "places-16161"
    },
    {
        "id": "places-16162"
    },
    {
        "id": "places-1115"
    },
    {
        "id": "places-6030"
    },
    {
        "id": "places-16149"
    },
    {
        "id": "places-610"
    },
    {
        "id": "places-6132"
    },
    {
        "id": "places-576"
    },
    {
        "id": "places-9305"
    },
    {
        "id": "places-2086"
    },
    {
        "id": "places-16137"
    },
    {
        "id": "places-15718"
    },
    {
        "id": "places-9581"
    },
    {
        "id": "places-1220"
    },
    {
        "id": "places-13749"
    },
    {
        "id": "places-1156"
    },
    {
        "id": "places-8904"
    },
    {
        "id": "places-9567"
    },
    {
        "id": "places-9274"
    },
    {
        "id": "places-8841"
    },
    {
        "id": "places-9944"
    },
    {
        "id": "places-648"
    },
    {
        "id": "places-15833"
    },
    {
        "id": "places-590"
    },
    {
        "id": "places-16156"
    },
    {
        "id": "places-16155"
    },
    {
        "id": "places-10247"
    },
    {
        "id": "places-10352"
    },
    {
        "id": "places-9220"
    },
    {
        "id": "places-8484"
    },
    {
        "id": "places-10519"
    },
    {
        "id": "places-17650"
    },
    {
        "id": "places-17618"
    },
    {
        "id": "places-17594"
    },
    {
        "id": "places-8317"
    },
    {
        "id": "places-17606"
    },
    {
        "id": "places-15832"
    },
    {
        "id": "places-8316"
    },
    {
        "id": "places-8315"
    },
    {
        "id": "places-10139"
    },
    {
        "id": "places-16064"
    },
    {
        "id": "places-8314"
    },
    {
        "id": "places-6943"
    },
    {
        "id": "places-8294"
    },
    {
        "id": "places-17506"
    },
    {
        "id": "places-9734"
    },
    {
        "id": "places-10628"
    },
    {
        "id": "places-9222"
    }
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
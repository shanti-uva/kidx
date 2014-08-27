/**
 * Created by ys2n on 8/18/14.
 */

var es = require("../connectors/essays");
var async = require("async");
var _ = require("underscore");

exports["testGetDocument"] = function(test) {

    test.expect(1);

    es.getDocument("207", function(err,doc) {
        if (err) {
            console.log("Error: " + JSON.stringify(err));
        }

        console.log("CALLBACK: " + JSON.stringify(doc));
        test.ok(doc !== null);
        test.done();
    });



};
exports["testGetItemIdList"] = function (test) {
    test.ok(false);
    test.done();
};

exports["testGetDocumentsByKmapId"] = function (test) {
    test.ok(false);
    test.done();
};

exports["testGetDocumentsByKMapIdStale"] = function (test) {
    test.ok(false);
    test.done();
};


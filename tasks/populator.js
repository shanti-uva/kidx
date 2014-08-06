/**
 * Created by ys2n on 7/16/14.
 *
 * This will be the set of functions needed to populate the index
 *
 * Will need to populate the index from multiple sources
 * Will need to handle multiple kmapid namespaces
 * Will need to queue and batch indexing jobs as needed.
 *
 */

var mb = require("../connectors/mediabase");
var ss = require("../connectors/sharedshelf");
var async = require("async");
var sm = require("../connectors/solrmanager");
var _ = require("underscore");

exports.documentStale = function (documentUid, staleTime, callback) {
    var now = new Date().getTime();
    sm.lastUpdated(documentUid, function(err, timestamp) {

        console.log("documentStale:")
//        console.log("   now       = " + now);
//        console.log("   timestamp = " + timestamp);
        console.log("   staleTime = " + staleTime);
        console.log("   diff      = " + (now-timestamp));
        console.log("   stale  = " + ((now - timestamp) > staleTime))


        if ((now - timestamp) > staleTime) {
            // console.log("documentStale calling back false to " + callback );
            callback(null,false);
        } else {
            // console.log("documentStale calling back true" );
            callback(null,true);
        }
    });
}

exports.getDocumentFromConnectorsByKMapId = function (kmapid, connectorlist, callback) {

    async.parallel(
        connectorlist,
        function(err,res) {
            callback(err,_.flatten(res))
        });

}

exports.getDocumentsByKMapId = function(kmapid, callback) {
    var connlist =
        [
            function(cb) {
                mb.getDocumentsByKmapId(kmapid,cb);
            },
            function(cb) {
                ss.getDocumentsByKmapId(kmapid,cb);
            }
        ];

    exports.getDocumentFromConnectorsByKMapId(kmapid, connlist, callback);

};

exports.getDocumentsByKMapIdStale = function(kmapid, staletime, callback) {
    var connlist =
        [
            function(cb) {
                mb.getDocumentsByKmapIdStale(kmapid, staletime, cb);
            },
            function(cb) {
                ss.getDocumentsByKmapIdStale(kmapid, staletime, cb);
            }
        ];

    exports.getDocumentFromConnectorsByKMapId(kmapid, connlist, callback);

};


exports.populateIndexByKMapId = function(kmapid, callback) {
//    console.trace("calling getDocumentsByKmapId with kmapid = " + kmapid);
    exports.getDocumentsByKMapId(kmapid,
            function (err, docs) {
                sm.addDocs(docs,callback);
                console.log("ADDED: " + JSON.stringify(docs,undefined,2));
            }
    )
}

exports.populateIndexByKMapIdStale = function(kmapid, staletime, callback) {
    exports.getDocumentsByKMapIdStale(kmapid,
        staletime,
        function (err, docs) {
            sm.addDocs(docs,callback);
            console.log("ADDED: " + JSON.stringify(docs,undefined,2));
        }
    )
}

exports.populateIndexByServiceIdStale = function (serviceConnector, id, staletime, callback) {
    exports.documentStale(serviceConnector.getUid(id), function(err, fresh) {
        if (fresh) {
            // short-circuit --  may need to mock up a response!
            callback(null,{});
        } else {
            // delegate
            exports.populateIndexByServiceId(serviceConnector, id, callback);
        }
    });

}

exports.populateIndexByServiceId = function (serviceConnector, id, callback) {

    serviceConnector.getDocument(id, function(err, doc) {
        if (err) {
            callback([], null);
        } else {
            sm.addDocs([doc], callback);
        }
    });
}

exports.rangePopulateIndexByService = function (serviceConnector, start, finish, callback) {
    async.concatSeries(_.range(start,finish+1), function(id,cb){
        exports.populateIndexByServiceId(serviceConnector, id, function( err, ret) {
            cb(err,ret);
        });
    },
    function(err,ret) {
        console.log("2Err = " + err);
        console.log("2Ret = " + JSON.stringify(ret));
        callback(err,ret);
    });
}

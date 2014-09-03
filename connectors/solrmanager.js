/**
 * Created by ys2n on 7/18/14.
 */

var solr = require('solr-client');

var asset_index_options = {
    'host': 'kidx.shanti.virginia.edu',
    'port': 80,
    'path': '/solr',
    'core': 'kmindex'
}

//var asset_index_options = {
//    'host': 'drupal-index.shanti.virginia.edu',
//    'port': 80,
//    'path': '/solr-test',
//    'core': '/kmindex'
//};

var term_index_options = {
    'host': 'kidx.shanti.virginia.edu',
    'port': 80,
    'path': '/solr',
    'core': 'termindex'
}

//var term_index_options = {
//    'host': 'drupal-index.shanti.virginia.edu',
//    'port': 80,
//    'path': '/solr-test',
//    'core': '/kmterms'
//};

var asset_client = solr.createClient(asset_index_options);
var term_client = solr.createClient(term_index_options);

exports.term_index_options = term_index_options;
exports.asset_index_options = asset_index_options;

exports.addDocs = function (docs, callback) {
    asset_client.autoCommit = true;
    asset_client.add(docs, function (err, report) {
        // console.dir(docs);
        if (err) {
            console.log(err);
        } else {
            console.log(report);
        }
        callback(err, report);
    });

}

exports.lastUpdated = function (solrclient, uid, callback) {
    var query = solrclient.createQuery().q("uid:" + uid)

    solrclient.search(query, function (err, obj) {
        if (err) {
            console.log("lastUpdated() Error using solrclient: " + JSON.stringify(solrclient.options));
            console.dir(err);
        } else {
            console.log("assetLastUpdated(): " + JSON.stringify(obj, undefined, 2));
            if (obj.response.numFound == 0) {
                console.log("calling back null,0 to " + callback);
                callback(null, 0);
            } else if (obj.response.docs[0].timestamp) {
                callback(null, new Date(obj.response.docs[0].timestamp).getTime());
            } else if (obj.response.docs[0]["_timestamp_"]) {
                callback(null, new Date(obj.response.docs[0]["_timestamp_"]).getTime())
            }

        }
    });
}

exports.assetLastUpdated = function (uid, callback) {
    exports.lastUpdated(asset_client,uid, callback);
}

exports.termLastUpdated = function (uid, callback) {
    exports.lastUpdated(term_client, uid, callback);
}

exports.getAssetEtag = function (uid, callback) {
    var query = asset_client.createQuery().q("uid:" + uid)

    asset_client.search(query, function (err, obj) {
        if (err) {
            console.log("getAssetEtag() Error:");
            console.dir(err);
        } else {
            console.log("getAssetEtag(): " + JSON.stringify(obj,undefined,2));
            if (obj.response.numFound == 0) {
                console.log("calling back null,null to " + callback);
                callback(null, null);
            } else if (obj.response.docs[0].etag) {
                callback(null, obj.response.docs[0].etag);
            }
        }
    });
}

exports.getTermCheckSum = function (uid, callback) {
    var query = term_client.createQuery().q("id:" + uid).fl("checksum");

    term_client.search(query, function (err, obj) {
        if (err) {
            console.log("getTermCheckSum() Error:");
            console.dir(err);
            callback(err,null);
        } else {
            // console.log("getTermCheckSum(): " + JSON.stringify(obj,undefined,2));
            if (obj.response.numFound == 0) {
                console.log("calling back null,null to " + callback);
                callback(null, null);
            } else if (obj.response.docs[0].checksum) {
                callback(null, obj.response.docs[0].checksum);
            } else {
                callback(null,null);
            }
        }
    });
}









exports.addTerms = function (terms, callback) {
    term_client.autoCommit = true;
    term_client.add(terms, function (err, report) {
        if (err) {
            console.log(err);
        } else {
            // console.log(report);
        }
        callback(err, report);
    });
}






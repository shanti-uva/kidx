/**
 * Created by ys2n on 7/18/14.
 */


var solr = require('solr-client');
var client = solr.createClient(
    {
        'host': 'drupal-index.shanti.virginia.edu',
        'port': 80,
        'path': '/solr-test',
        'core': '/kmindex'
    }
);

var termclient = solr.createClient(
    {
        'host': 'drupal-index.shanti.virginia.edu',
        'port': 80,
        'path': '/solr-test',
        'core': '/kmterms'
    }
);

exports.addDocs = function (docs, callback) {
    client.autoCommit = true;
    client.add(docs, function (err, report) {
        // console.dir(docs);
        if (err) {
            console.log(err);
        } else {
            console.log(report);
        }
        callback(err, report);
    });

}

exports.lastUpdated = function (uid, callback) {
    var query = client.createQuery().q("uid:" + uid)

    client.search(query, function (err, obj) {
        if (err) {
            console.log("lastUpdated() Error:");
            console.dir(err);
        } else {
//            console.log("lastUpdated(): " + JSON.stringify(obj,undefined,2));
            if (obj.response.numFound == 0) {
                console.log("calling back null,0 to " + callback);
                callback(null, 0);
            } else if (obj.response.docs[0].timestamp) {
                callback(null, new Date(obj.response.docs[0].timestamp).getTime());
            }

        }
    });
}

exports.addTerms = function (terms, callback) {
    termclient.autoCommit = true;
    termclient.add(terms, function (err, report) {
        if (err) {
            console.log(err);
        } else {
            console.log(report);
        }
        callback(err, report);
    });
}






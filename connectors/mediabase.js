/**
 * Created by ys2n on 7/6/14.
 * TODO:  Needs to handle places!
 * TODO: Need to agree upon places vs subjects handling (separate namespaces or unique id's in single namespace?)
 */

var async = require('async');
var populator = require('../tasks/populator');
var _ = require('underscore');

exports.getItemIdList = function (kid, callback) {
//    var result  = $.ajax("http://mediabase.drupal-dev.shanti.virginia.edu/services/kmaps/" + kmapid);
    var http = require('http');

    // sloppy way of translating id...
    var kmapid = (kid.replace)?kid.replace('subjects-','').replace('places-','p'):kid;

    var options = {
        host: 'mediabase.drupal-dev.shanti.virginia.edu',
        port: 80,
        path: '/services/kmaps/' + kmapid + ".json",
        method: 'GET'
    };

    var ret = [];

    http.request(options,function (res) {
        var raw = [];
//        console.log('STATUS: ' + res.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            raw.push(chunk);
        });

        res.on('end', function () {
            var obj = JSON.parse(raw.join(''));
            ret = _.unique(obj.items);
            console.log("Lookup for kmapid " + kmapid + " returns " + ret);
            callback(null, ret);
        })

    }).end();

};


//exports.getDocumentXML = function (docid, callback) {
//
//    var dom = require('xmldom').DOMParser
//    var xpath = require('xpath');
//    var parseString = require('xml2js').parseString;
//    var http = require('http');
//
//    var options = {
//        host: 'mediabase.drupal-dev.shanti.virginia.edu',
//        port: 80,
//        path: '/services/solrdoc/' + docid,
//        method: 'GET'
//    };
//
//    var doc = {};
//
//    console.log("Attempting to contact: " + JSON.stringify(options));
//
//    http.request(options,function (res) {
//        var raw = [];
////        console.log('STATUS: ' + res.statusCode);
////        console.log('HEADERS: ' + JSON.stringify(res.headers));
//        res.setEncoding('utf8');
//        res.on('data', function (chunk) {
//            raw.push(chunk);
//        });
//
//        res.on('end', function () {
//            var xmldoc = new dom().parseFromString(raw.join(''));
//            console.log(xmldoc.toString());
//            var kmapids = [];
//            var kmapnodes = xpath.select("//field[@name='kmapid']/text()", xmldoc);
//            kmapnodes.forEach( function(x) {kmapids.push(
//                "subjects-" + x.nodeValue)});
//            var pdidnodes = xpath.select("//field[@name='pdid']/text()", xmldoc)
//            pdidnodes.forEach( function(x) {kmapids.push(
//                "places-" + x.nodeValue)});
//
//            doc.kmapid = _.unique(kmapids);
//            doc.url = xpath.select("//field[@name='url']/text()",xmldoc)[0].nodeValue;
//            doc.bundle = xpath.select("//field[@name='bundle']/text()",xmldoc)[0].nodeValue;
//            doc.description = xpath.select("//field[@name='content']/text()",xmldoc)[0].nodeValue;
//            doc.id = xpath.select("//field[@name='entity_id']/text()",xmldoc)[0].nodeValue;
//            doc.service = "mediabase";
//            doc.uid = doc.service + "-" + doc.id;
//            callback(null,doc);
//        })
//    }).end();
//
//
//}

exports.getDocument = function (docid, callback) {

    var http = require('http');

    var options = {
        host: 'mediabase.drupal-dev.shanti.virginia.edu',
        port: 80,
        path: '/services/solrdoc/' + docid + ".json",
        method: 'GET'
    };

    var doc = {};

    console.log("Attempting to contact: " + JSON.stringify(options));

    http.request(options,function (res) {
        var raw = [];
        // console.log('STATUS: ' + res.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            raw.push(chunk);
        });

        res.on('end', function () {
            try {
                var obj = JSON.parse(raw.join(''));
                console.log(JSON.stringify(obj,undefined,2));
                var kmapids = [];
                if(obj.kmapid) obj.kmapid.forEach( function(x) {kmapids.push(
                    "subjects-" + x)});
                var pdidnodes = [];
                if(obj.pdid) obj.pdid.forEach( function(x) {kmapids.push(
                    "places-" + x)});

                if (res.headers.etag) { doc.etag = res.headers.etag }
                doc.kmapid = _.unique(kmapids);
                doc.url = obj.url;
                doc.bundle = obj.bundle;
                // doc.description = obj.content;
                doc.summary = obj.content;
                doc.caption = obj.label;
                doc.id = obj.entity_id;
                doc.service = "mediabase";
                doc.uid = doc.service + "-" + doc.id;
                doc.thumbnail_url = obj.thumbnail_url;
                callback(null,doc);
            }
            catch(err) {
                console.log("Error: " + err );
                callback(err,null);
            }
        })
    }).end();
}

exports.getDocumentsByDocIds = function(docids, callback) {

    async.waterfall(
        [
            function(cb) {
                async.mapLimit(docids, 10, exports.getDocument,
                    function(err,doc) { console.log("DONE");
                        if (err) {
                            console.log("ERROR: " + err);
                        }
                        cb(err,doc);
                    }
                );
            }
        ],
        function(err,results) {
            if (err) {
                console.log("ERROR: " + err);
            }
            // console.log("FINALLY:  " + JSON.stringify(results));

            callback(null,results);
        }
    );
}

exports.getDocumentsByKmapIdStale = function(kmapid, staletime, callback) {


    async.waterfall(
        [
            function(cb) {
                exports.getItemIdList(kmapid,cb);
            },
            function(itemIdList, callback) {

                // cull the itemIdList per timestamp
                // Hmmm.  here's where we need to cull the itemidlist
                // by check each item against the solr timestamps....
                // Messy but you should be able to do it!

                async.waterfall([
                    function(callback) {
                        // filter the list
                        async.filter(itemIdList,
                            function (item, cb2) {
                                item = "mediabase-" + item;
                                populator.documentStale(item, staletime, function (err, answer) {
                                    cb2(!answer);
                                } );
                            },function(result) {
                                callback(null,result);
                            }
                        );
                    }
                ],
                    function(err,finalItemIdList) {
                        console.dir(finalItemIdList);
                        async.mapLimit(finalItemIdList, 2, exports.getDocument,
                            function(err,doc) {
                                // console.log(JSON.stringify(doc,undefined,3));
                                callback(null,doc);
                            }
                        )
                    })
            }
        ],
        function(err,results) {
            console.log("FINALLY:  " + JSON.stringify(results));
            callback(null,results);
        }
    );

}


exports.getDocumentsByKmapId = function(kmapid, callback) {

    async.waterfall(
        [
            function(cb) {
//                console.trace("calling getItemIdList with " + kmapid);
                exports.getItemIdList(kmapid,cb);
            },
            function(itemIdList, cb) {
                async.mapLimit(itemIdList, 5, exports.getDocument,
                    function(err,doc) { console.log("DONE");
                        // console.log(JSON.stringify(doc,undefined,3));
                        cb(null,doc);
                    }
                );
            }
        ],
        function(err,results) {
            // console.log("FINALLY:  " + JSON.stringify(results));
            callback(null,results);
        }
    );
}
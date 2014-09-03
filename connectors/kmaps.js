/**
 * Created by ys2n on 8/7/14.
 */

var _ = require('underscore');
var traverse = require('traverse');
var http = require('http');
var crypto = require('crypto');

function grokKClass(kmapid) {
    var parts = kmapid.split('-');
    var kclass = parts[0];
    var kid = parts[1];

    // sanity check kclass
    if (kclass !== "subjects" && kclass !== "places") {
        throw new Error("unknown kclass " + kclass + " in kmapid " + kmapid);
    }
    return {kclass: kclass, kid: kid};
}
exports.getKmapsDocument = function (kmapid, callback) {

    // This is a "universal" kmapid.   Translate!
    var __ret = grokKClass(kmapid);
    var kclass = __ret.kclass;
    var kid = __ret.kid;

    var options = {
        host: kclass + '.kmaps.virginia.edu',
        port: 80,
        path: '/features/' + kid + ".json",
        method: 'GET'
    };

    var doc = {};

    console.log("Attempting to contact: " + JSON.stringify(options));

    http.request(options,function (res) {
        var raw = [];

        var doc = {};
//        var doc = {
//            'feature_types': [], // feature_type @title @id
//            'feature_type_ids': [],
//            'names': [], // name @language @view @name @writing_system
//            'captions': [], // caption @language @content
//            'summaries': [], // summary/content summary/language
//            'descriptions': [], // description  Ask Andres!!
//            'illustrations': [], // picture @url @type
//            'interactive_map_url': null,
//            'kmz_url': null,
//            'header': null,
//            'created_at': null,
//            'updated_at': null
//        };
//        console.log('STATUS: ' + res.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            raw.push(chunk);
        });

        res.on('end', function () {
            try {
                var obj = JSON.parse(raw.join(''));

                // console.log("HOOOOOOOOOOOOOOPIE:" + JSON.stringify(obj, undefined, 2));

                if (res.headers.etag) {
                    doc.etag = res.headers.etag
                }
                // ID should be unique
                doc.id = kclass + "-" + obj.feature.id;

                // Header
                doc.header = obj.feature.header;

                doc.tree = kclass;

                // Feature_types
                if (obj.feature.feature_types)
                    obj.feature.feature_types.forEach(function (x) {
                        addEntry(doc, 'feature_types', x.title);
                        // doc.feature_types.push(x.title);
                        addEntry(doc, 'feature_type_ids', x.id)
                        // doc.feature_type_ids.push(x.id);
                    });

                // Names:  these will be joined in the index
                // console.log(JSON.stringify(obj.feature.names, undefined, 2))


                // NEED TO USE THE names INTERFACE INSTEAD for completeness
                obj.feature.names.forEach(function (x) {
                    var fieldname = "name_" + x.language + "_" + x.view + "_" + x.writing_system + ((x.orthographic_system) ? "_" + x.orthographic_system : "");
                    doc[fieldname] = x.name;
                });


                // Captions
                // console.log("CAPTIONS:" + JSON.stringify(obj.feature.captions,undefined,2))
                obj.feature.captions.forEach(function (x) {
                    var lang = x.language;
                    var content = x.content;
                    doc['caption_' + lang] = content;
                });

                // Summaries
                // console.log(JSON.stringify(obj.feature.summaries, undefined, 2));
                obj.feature.summaries.forEach(function (x) {
                    var lang = x.language;
                    var content = x.content;
                    doc['summary_' + lang] = content;
                });

                // Descriptions

                // Descriptions are a mystery.  Ask Andres!

                // console.log(JSON.stringify(obj.feature.illustrations, undefined, 2));
                obj.feature.illustrations.forEach(function (x) {
                    var url = x.url;
                    var type = x.type;

                    addEntry(doc, 'illustration_' + type + '_url', url);

                    // doc['illustration_' + type + '_url']=url;
                });


                // ANCESTORS!  by PERSPECTIVE

                if (obj.feature.perspectives) {
                    obj.feature.perspectives.forEach(function (pers) {
                        pers.ancestors.forEach(function (x) {
                            var ancestor = x.header;
                            var ancestorid = x.id;

                            if (!pers) {
                                pers = { code: null };
                            }
                            // console.log("ANCESTOR: " + pers.code + ":" + ancestorid + ":" + ancestor);

                            addEntry(doc, 'ancestors_' + pers.code, ancestor);
                            addEntry(doc, 'ancestor_ids_' + pers.code, ancestorid);

                        })
                    });
                } else {
                    obj.feature.ancestors.forEach(function (x) {
                    var ancestor = x.header;
                    var ancestorid = x.id;

                    var pers = "default";

                    // console.log("ANCESTOR: " + pers+ ":" + ancestorid + ":" + ancestor);

                    addEntry(doc, 'ancestors_' + pers, ancestor);
                    addEntry(doc, 'ancestor_ids_' + pers, ancestorid);

                });
                }

                doc.interactive_map_url = obj.feature.interactive_map_url;
                doc.kmz_url = obj.feature.kmz_url;
                doc.created_at = obj.feature.created_at;
                doc.updated_at = obj.feature.updated_at;
                doc.has_shapes = Boolean(obj.feature.has_shapes);
                doc.has_altitudes = Boolean(obj.feature.has_altitudes);
                if (obj.feature.closest_fid_with_shapes)
                    doc.closest_fid_with_shapes = obj.feature.closest_fid_with_shapes;
                doc.checksum = checksum(doc);

                callback(null, doc);
            }
            catch (err) {
//                throw err;
                console.log("Error: " + err);
                console.log("Return was: " + raw.join('\n'));
                callback(err, null);
            }
        });
        res.on('error', function (e) {
            // General error, i.e.
            //  - ECONNRESET - server closed the socket unexpectedly
            //  - ECONNREFUSED - server did not listen
            //  - HPE_INVALID_VERSION
            //  - HPE_INVALID_STATUS
            //  - ... (other HPE_* codes) - server returned garbage
            console.log(e);
        });
    }).end();
}


exports.checkEtag = function (kmapuid, callback) {

    // This is a "universal" kmapid.   Translate!
    var __ret = grokKClass(kmapuid);
    var kclass = __ret.kclass;
    var kid = __ret.kid;

    var options = {
        host: kclass + '.kmaps.virginia.edu',
        port: 80,
        path: '/features/' + kid + ".json",
        method: 'HEAD'
    };

    http.request(options, function (res) {

//        console.log("Getting HEAD: " + JSON.stringify(options));
//        console.log("HEADERS: " + JSON.stringify(res.headers));

        if (res.headers.etag) {
            callback(null, res.headers.etag);
        } else {
            callback(null, null);
        }

    })


}


function addEntry(doc, field, data) {
    // first determine if the field exists

    // console.log("addEntry: " + field + " = " + JSON.stringify(data));


    if (doc[field]) {
        // if it exists and isn't an array convert to an array and re-add value to the array
        if (!_.isArray(doc[field])) {
            var save = doc[field];
            doc[field] = [ save ];
        }

        // push the new data into the array
        doc[field].push(data);
        // console.log("pushed: " + JSON.stringify(data));

    } else {
        // else treat it as a single value
        doc[field] = data;
        // console.log("inserted: " + JSON.stringify(data));
    }

}

exports.getKmapsTree = function (host, callback) {
    var kmaps_options = {
        host: host,
        port: 80,
        path: '/features/fancy_nested.json',
        method: 'GET'
    };

    console.log("TRyING: " + JSON.stringify(kmaps_options));

    var raw = [];
    var obj = {};
    http.request(kmaps_options,function (res) {
        try {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                // console.log("data: " + chunk);
                raw.push(chunk);
            });
            res.on('end', function () {
                obj = JSON.parse(raw.join(''));
                // console.log("end: " + raw.join(''));
                callback(null, obj);
            });

        }
        catch (err) {
            console.log("Error: " + err);
            callback(err, null);
        }
    }).end();


}

exports.getKmapsList = function (host, callback) {
    exports.getKmapsTree(host, function (err, obj) {
        var nodes = traverse(obj).reduce(function (acc, x) {
            if (x.key) {
                acc.push(x.key)
            }
            ;
            return acc;
        }, []);
        callback(err, nodes);
    });

}


// Use etags (and maybe code version?) to determine staleness.
// Use names api!
// Add "ancestors"
// wonder maybe the harvesting should remain here and the services just notify of changes.


function checksum (obj, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'sha1')
        .update(JSON.stringify(obj), 'utf8')
        .digest(encoding || 'hex')
}

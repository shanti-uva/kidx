/**
 * Created by ys2n on 8/7/14.
 */

var _ = require('underscore');
var traverse = require('traverse');
var http = require('http');

exports.getKmapsDocument = function (kmapid, callback) {

    // This is a "universal" kmapid.   Translate!

    var parts = kmapid.split('-');
    var kclass = parts[0];
    var kid = parts[1];

    // sanity check kclass
    if (kclass !== "subjects" && kclass !== "places") {
        throw new Error("unknown kclass " + kclass + " in kmapid " + kmapid);
    }

    var options = {
        host: 'dev-' + kclass + '.kmaps.virginia.edu',
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
        // console.log('STATUS: ' + res.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            raw.push(chunk);
        });

        res.on('end', function () {
            try {
                var obj = JSON.parse(raw.join(''));

//                console.log("HOOOOOOOOOOOOOOPIE:" + JSON.stringify(obj, undefined, 2));

                // ID should be unique
                doc.id = obj.feature.id;

                // Header
                doc.header = obj.feature.header;

                // Feature_types
                if (obj.feature_types)
                obj.feature.feature_types.forEach(function (x) {

                    addEntry(doc, 'feature_types', x.title);
                    // doc.feature_types.push(x.title);
                    addEntry(doc, 'feature_type_ids', x.id)
                    // doc.feature_type_ids.push(x.id);
                });

                // Names:  these will be joined in the index
                // console.log(JSON.stringify(obj.feature.names,undefined,2))

                obj.feature.names.forEach(function (x) {
                    var fieldname = "name_" + x.language + "_" + x.view + "_" + x.writing_system + ((x.orthographic_system) ? "_" + x.orthographic_system : "");
                    doc[fieldname] = x.name;
                });


                // Captions
//                console.log(JSON.stringify(obj.feature.captions,undefined,2))
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


                doc.interactive_map_url = obj.feature.interactive_map_url;
                doc.kmz_url = obj.feature.kmz_url;
                doc.created_at = obj.feature.created_at;
                doc.updated_at = obj.feature.updated_at;
                doc.has_shapes = Boolean(obj.feature.has_shapes);
                doc.has_altitudes = Boolean(obj.feature.has_altitudes);
                doc.closest_fid_with_shapes = obj.feature.closest_fid_with_shapes;
                callback(null, doc);
            }
            catch (err) {
                throw err;
                console.log("Error: " + err);
                callback(err, null);
            }
        })
    }).end();
}


function addEntry(doc, field, data) {
    // first determine if the field exists

    if (doc[field]) {
        // if it exists and isn't an array convert to an array and re-add value to the array
        if (!_.isArray(doc[field])) {
            var save = doc[field];
            doc[field] = [ save ];
        }

        // push the new data into the array
        doc[field].push(data);
    } else {
        // else treat it as a single value
        doc[field] = data;
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
    http.request(kmaps_options, function (res) {
        try {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
//                console.log("data: " + chunk);
                raw.push(chunk);
            });
            res.on('end', function () {
                obj = JSON.parse(raw.join(''));
//                console.log("end: " + raw.join(''));
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
    exports.getKmapsTree(host, function(err,obj) {
        var nodes = traverse(obj).reduce(function (acc, x) {
            if (x.key) { acc.push(x.key) };
            return acc;
        }, []);
        callback(err,nodes);
    });

}
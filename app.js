/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var lookup = require('./routes/lookup');
var stream = require('./routes/stream');
var http = require('http');
var path = require('path');
var httpProxy = require('http-proxy');
var url = require('url');
var pop = require('./tasks/populator');


const STALE_TIME =  60 * 60 * 1000;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret here' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/lookup/:id', lookup.lookup);
app.get('/stream', stream.stream);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));






    // Proxy Setup
//
    var proxy = httpProxy.createProxyServer({});
    var proxyserver = http.createServer(function(req, res) {
        // You can define here your custom logic to handle the request
        // and then proxy the request.

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        console.log("REQ.QUERY: " + JSON.stringify(query,undefined,3));

        var q = query.q;
        var rgx = /kmapid:(.*)/;  //need to refine this regex!
        var match = rgx.exec(q);

        if (match !== null && match.length > 1)  {
            console.log("We extracted " + match[1]);
            pop.populateIndexByKMapIdStale(match[1], STALE_TIME,
                function() {
                    proxy.web(req, res, { target: 'http://localhost:8983' });
                });
        } else {
            proxy.web(req, res, { target: 'http://localhost:8983' });
        }
    });

    console.log("proxy listening on port 3001");
    proxyserver.listen(3001);
});
/**
 * Created by ys2n on 8/4/14.
 */
var sys=require('sys');
var fs=require('fs');

exports.stream = function (req, res) {
    if (req.headers.accept && req.headers.accept == 'text/event-stream') {
        if (req.url == '/stream') {
            sendSSE(req, res);
        } else {
            res.writeHead(404);
            res.end();
        }
    } else {
        res.redirect("/");
        res.end();
    }
};


function sendSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    var id = (new Date()).toLocaleTimeString();

    // Sends a SSE every 5 seconds on a single connection.
    var i = 0;

    setInterval(function() {
        constructSSE(res, id, (new Date()).toLocaleTimeString() + ' boinky ' + i++);
    }, 5000);

    constructSSE(res, id, (new Date()).toLocaleTimeString() + " Starting");
}

function constructSSE(res, id, data) {
    res.write('id: ' + id + '\n');
    res.write("data: " + data + '\n\n');
}

function debugHeaders(req) {
    sys.puts('URL: ' + req.url);
    for (var key in req.headers) {
        sys.puts(key + ': ' + req.headers[key]);
    }
    sys.puts('\n\n');
}
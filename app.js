var http = require('http'),
	StaticServer = require('node-static').Server,
	file = new StaticServer('./public'),
	fs = require ('fs');

http.createServer(function(req, res) {
    if(req.url == '/lastModified') {
        fs.stat('./public/list.json', function(err, stats) {
        	res.writeHead(200, { "Content-Type" : "text/plain" });
			res.end(stats.mtime.toString());
		});
    } else {
        file.serve(req, res, function(err) {
            if(err) {
                file.serveFile("/404.html", "404", {}, req, res);
            }
        });
    }
}).listen(process.env.PORT || 8080);

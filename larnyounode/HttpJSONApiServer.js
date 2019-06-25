var http = require("http");
http.createServer(function (req, res) {
    if (req.method != "GET") {
        res.end("Send me a get");
        return;
    }
    
    var u = require('url').parse(req.url, true);
    res.writeHead(200, { "Content-Type": "application/json" });
    var d = new Date(u.query.iso);
    if (u.pathname.indexOf("api/parsetime") != -1) {
        
        var result = {
            "hour": d.getHours(),
            "minute": d.getMinutes(),
            "second": d.getSeconds()
        };
        res.end(JSON.stringify(result));
    }
    else if(u.pathname.indexOf("api/unixtime") != -1) {
        var result = {
            "unixtime" : d.getTime()
        };
        res.end(JSON.stringify(result));
    }


}).listen(Number(process.argv[2]));

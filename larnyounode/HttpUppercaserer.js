var http = require("http");
var d = "";
http.createServer(function (req, res) {
    if(req.method == "POST")
    {
        req.on('data', function (data) {
            d += data.toString();
        });
        req.on('end', function () {
            res.end(d.toUpperCase());
        });
    }
}).listen(process.argv[2]);

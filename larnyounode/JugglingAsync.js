var http = require("http");
var serverresponse = [{ f: 0, d: "" }, { f: 0, d: "" }, { f: 0, d: "" }];
var allDone = function () {
    return serverresponse && (serverresponse[0].f & serverresponse[1].f & serverresponse[2].f);
}
function printoutput()
{
    if (allDone()) 
    serverresponse.forEach(function (v) {
        console.log(v.d);
    });
}
http.get(process.argv[2], function (response) {

    response.on("data", function (data) {
        serverresponse[0].d += data.toString();
    });
       
            response.on("error", function (err) {
                console.log("There was error");
            });
            response.on("end", function () {
                serverresponse[0].f = 1;
                printoutput();
            });
        });
http.get(process.argv[3], function (response) {
    response.on("data", function (data) {
        serverresponse[1].d += data.toString();
    });

            response.on("error", function (err) {
                console.log("There was error");
            });
            response.on("end", function () {
                serverresponse[1].f = 1;
                printoutput();
            });
        });

http.get(process.argv[4], function (response) {
    response.on("data", function (data) {
        serverresponse[2].d += data.toString();
    });

            response.on("error", function (err) {
                console.log("There was error");
            });
            response.on("end", function () {
                serverresponse[2].f = 1;
                printoutput();
            });
        });

    
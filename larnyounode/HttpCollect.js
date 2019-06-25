var http = require("http");
var serverresponse = "";
http.get(process.argv[2], function (response) {
    response.on("data", function (data) {
        serverresponse += data.toString();
    });
    response.on("error", function (err) {
        console.log("There was error");
    });
    response.on("end", function () {
        console.log(serverresponse.length);
        console.log(serverresponse);
    });
});
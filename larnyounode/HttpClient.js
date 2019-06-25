var http = require("http");

http.get(process.argv[2], function (response) {
    response.on("data", function (data) {
        console.log(data.toString());
    });
    response.on("error", function (err) {
        console.log("There was error");
    });
   
});
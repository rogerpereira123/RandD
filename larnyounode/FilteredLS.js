var fs = require("fs");
var path = require("path");
var ext = process.argv[3];
fs.readdir(process.argv[2], function (err, data) {
    if (err) {
        console.log("There was an error");
        return;
    }
    for (i = 0 ; i < data.length; i++) {
        
        if (path.extname(data[i]) == "." +ext)
            console.log(data[i]);
    }
});
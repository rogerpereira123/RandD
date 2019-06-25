// JavaScript source code
module.exports = function(dir, ext, callback)
{
    var fs = require("fs");
    var path = require("path");
    fs.readdir(dir, function (err, data) {
        if (err) {
            callback(err);
            return;
        }

        var filteredList = new Array();
        for (i = 0 ; i < data.length; i++) {

            if (path.extname(data[i]) == "." + ext)
                filteredList.push(data[i]);
        }
        callback(null , filteredList)
    });
}
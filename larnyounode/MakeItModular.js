var fls = require("./FilteredLSModule");
fls(process.argv[2], process.argv[3], function (err, data) {
    if(err)
    {
        console.log("There was an error");
        return;
    }
    data.forEach(function (v, i) { console.log(data[i]); });
});

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var template = {};

fs.readFile( './public/index.html', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    template.re = /--(.*)--/gi;
    template.variables = data.match(template.re);
    console.log("\n=== Gathering Assets ===");
    Promise.each(template.variables, function(block){
        var blockName = block.replace(/--/gi,'');
        console.log("--> " + blockName);
        return fs.readFileAsync('./public/' + blockName + '.html', "utf8").then(function (contents) {
            data = data.replace(RegExp(block, "g"), contents);
        });
    }).then(function() {
        renderPath = 'generated/index.html';
        console.log("\n=== Rendering Html... ===\n");
        fs.writeFile(renderPath, data, 'utf8', function(e, data){
            if(e) {
                console.log("\n=== Oh dang... I broke. \n try again :( ===\n");
                console.error(e.stack);
            } else {
                console.log("\n=== Done! ===\n Download @ " + __dirname +"/"+ renderPath);
            }
        });
    }).catch(function(e) {
        console.log("\n=== Darn, I broke. try again :( ===\n");
        console.error(e.stack);
    });

});
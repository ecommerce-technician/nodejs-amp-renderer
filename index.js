var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var template = {};

fs.readFile( './public/index.html', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    template.re = /--(.*)--/gi;
    template.variables = data.match(template.re);
    Promise.each(template.variables, function(block){
        var blockName = block.replace(/--/gi,'');
        console.log(blockName);
        return fs.readFileAsync('./public/' + blockName + '.html', "utf8").then(function (contents) {
            data = data.replace(RegExp(block, "g"), contents);
        });
    }).then(function() {
        console.log(data);
    }).catch(function(e) {
        //console.error(e.stack);
    });

});
var indentText = require(".lib/text").indentText;

module.exports.indentText = function(text, callback){
    callback(null, indentText(text));
};

module.exports.indentHTML = require(".lib/html").indentHTML;
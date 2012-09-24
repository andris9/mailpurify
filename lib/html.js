var jsdom = require("jsdom");


/**
 * Tidies up mail HTML body into HTML with nested quotes
 *
 * @param {String} text E-mail html body
 * @param {Function} callback Callback function to run when ready
 */
module.exports.indentHTML = function(html, callback){
    html = (html || "").toString().trim();
    
    if(!html){
        return callback(null, "");
    }

    jsdom.env(html, function(err, window){
        var tags;

        if(err){
            return callback(err);
        }

        // remove scripts
        while((tags = window.document.getElementsByTagName("script")).length){
            tags[0].parentNode.removeChild(tags[0]);
        }

        // remove style blocks
        while((tags = window.document.getElementsByTagName("style")).length){
            tags[0].parentNode.removeChild(tags[0]);
        }

        callback(null, window.document.body.innerHTML);
    });
}
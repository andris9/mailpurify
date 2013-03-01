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

    html = (html || "").toString().trim();

    return callback(null, html);
}
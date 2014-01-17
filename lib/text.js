
/**
 * Converts mail text body into HTML with nested quotes
 *
 * @param {String} text E_mail text body
 * @param {Number} [level=0] Nesting level
 * @return {String} HTML code
 */
module.exports.indentText = function(text, level){
    return replaceURLWithHTMLLinks(indenter(text)).trim();
}

function indenter(text, level){
    var nodes = [], node, type = "default", startPos = false, lines, group, match;

    text = (text || "").toString();
    level = level || 0;

    // Handle Outlook and friends
    lines = text.split(/\r?\n/);
    for(var i=3, j=3, len = lines.length; i<len; i++){
        if(lines[i].match(/^[\w\-]+\:\s*.+/)){
            group = {};
            j = i;
            while(j<len && (match = lines[j].match(/^([\w\-]+)\:\s*.+/))){
                group[match[1].trim().toLowerCase()] = true;
                j++;
            }
            if(group.subject && group.from && j-i >= 3){
                while(i<len){
                    lines[i] = "> "+lines[i];
                    i++;
                }
                text = lines.join("\n");
                break;
            }
            i = j;
        }
    }

    text.
        // replace multiple linebreaks
        replace(/(\r?\n){2,}/g, "\n\n").

        // split lines
        split(/\r?\n/).forEach(function(line){
            line = line.replace(/\s*$/, "");
            // only allow nesting up to level 20
            if(level < 20 && line.match(/^>/)){
                line = line.substr(1);
                if(type == "quote"){
                    if(line.length && line.charAt(0) != ">"){
                        startPos = line.match(/^\s*/)[0].length;
                        if(node.startPos === false || startPos < node.startPos){
                            node.startPos = startPos;
                        }
                    }
                    node.lines.push(line);
                }else{
                    if(line.length && line.charAt(0) != ">"){
                        startPos = line.match(/^\s*/)[0].length;
                    }else{
                        startPos = false;
                    }
                    node = {type: "quote", startPos: startPos, lines: [line]};
                    nodes.push(node);
                    type = "quote";
                }
            }else if(!line){
                type = "default";
            }else{
                if(type == "text"){
                    node.lines.push(line);
                }else{
                    node = {type: "text", lines: [line]};
                    nodes.push(node);
                    type = "text";
                }
            }
        });

    // convert found nodes to html
    text = nodes.map(function(node){
            if(node.type == "text"){
                return "<p>" + node.lines.map(function(line){
                        return line.replace(/&/g,"&amp;").
                            replace(/^\s+/, function(str){
                                return new Array(str.length+1).join("&nbsp;");
                            }).
                            replace(/</g,"&lt;").
                            replace(/>/g,"&gt;").
                            replace(/"/g,"&quot;");
                    }).join("<br />\n") + "</p>";
            }else if(node.type == "quote"){
                return "<blockquote class=\"pd-nested pd-nesting-level-"+(level+1)+"\">\n" + 
                    indenter(node.lines.map(function(line){
                        return line.substr(line.charAt(0) != ">" && node.startPos || 0);
                    }).join("\n"), level + 1) + 
                    "</blockquote>";
            }
        }).join("\n");

    return text;
}

// Modified http://stackoverflow.com/a/37687
function replaceURLWithHTMLLinks(text){
    var exp = /(\b(?:https?|ftp|file):\/\/|mailto:)([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, function(full, prefix, link){
        return '<a href="'+full+'">'+(prefix.toLowerCase() != "mailto:" ? full : link)+'</a>';
    }); 
}

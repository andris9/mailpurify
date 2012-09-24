var testCase = require('nodeunit').testCase,
    indentText = require("../lib/text").indentText,
    MailParser = require("mailparser").Mailparser,
    jsdom = require("jsdom");

exports["Simple paragraphs"] = function(test){
    var mailText = 'This is line nr 1\r\n'+
                   'This is the same paragraph\n\n'+
                   'This is another paragraph\n\n'+
                   'And yet another paragraph';
    
    jsdom.env(indentText(mailText), function(err, window){
        var list;

        test.ifError(err);
        test.ok(!!window);

        list = Array.prototype.slice.call(window.document.body.getElementsByTagName("p") || []);

        test.equal(list.length, 3);
        test.equal((list[0].innerHTML || "").trim(), 'This is line nr 1<br />\nThis is the same paragraph');
        test.equal((list[1].innerHTML || "").trim(), 'This is another paragraph');
        test.equal((list[2].innerHTML || "").trim(), 'And yet another paragraph');

        test.done();
    });
}

exports["Quote block"] = function(test){
    var mailText = 'This is line nr 1\r\n'+
                   '> This is the same paragraph\n'+
                   '> This is another paragraph\n'+
                   '> And yet another paragraph';

    jsdom.env(indentText(mailText), function(err, window){
        test.ifError(err);
        test.ok(!!window);

        test.equal(Array.prototype.slice.call(window.document.body.getElementsByTagName("p") || []).length, 2);
        test.equal(Array.prototype.slice.call(window.document.body.getElementsByTagName("blockquote") || []).length, 1);

        test.done();
    });
}
var testCase = require('nodeunit').testCase,
    indentHTML = require("../lib/html").indentHTML,
    MailParser = require("mailparser").Mailparser,
    jsdom = require("jsdom");

exports["Simple paragraphs"] = function(test){
    var mailHtml = "<p>test</p><script>ffff</script><p>sdfsd</p>";
    indentHTML(mailHtml, function(err, html){
        console.log(html)
        test.ifError(err)
        test.done();
    });
}
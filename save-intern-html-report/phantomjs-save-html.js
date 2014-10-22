// Runs the intern client.html for your tests and outputs the HTML result to the console

var url = phantom.args[0] || "http://localhost:8080/node_modules/intern/client.html?config=tests/intern";
var timeToWaitForPageMs = phantom.args[1] || 5000;

var fs = require("fs");
var saveHtml = require("./save-html");

// http://phantomjs.org/api/fs/method/read.html
var css = fs.read("./node_modules/intern/lib/reporters/html/html.css", "utf8");

var timeoutMessage = "Timed out waiting for '/client/end' topic to be published.\n" +
    " Consider increasing the timeout if you have lots of unit tests.";

saveHtml.saveHtml(url, {
    timeToWaitForPageMs: timeToWaitForPageMs,

    timeoutMessage: timeoutMessage,

    callbackResponsibleForCallPhantom: function(css) {
        function fixHtmlForLocalViewing(html) {
            return html.replace("</head>", "<style>\n" + css + "\n</style></head>");
        }

        // Register an interest for when the intern has finished its client tests.
        require(["intern/node_modules/dojo/topic"], function(topic) {
            topic.subscribe("/client/end", function() {
                if (typeof window.callPhantom === "function") {
                    var html = fixHtmlForLocalViewing(document.documentElement.outerHTML);
                    window.callPhantom({ html: html });
                }
            });
        });
    },

    callbackArgs: [css]
});

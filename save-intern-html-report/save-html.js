var page = new WebPage();

// http://phantomjs.org/api/webpage/handler/on-error.html
page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
    }

    console.error(msgStack.join('\n'));
};

// http://phantomjs.org/api/webpage/handler/on-callback.html
page.onCallback = function(data) {
    console.log(data.html || data.message);
    // exit always unless explicitly told not to.
    if (false !== data.exit) {
        phantom.exit();
    }
}

function waitForPageHtml(page, timeToWaitForPageMs, timeoutMessage, callbackResponsibleForCallPhantom) {
    setTimeout(function() {
        page.onCallback({
            timeout: true,
            message: timeoutMessage
        });
    }, timeToWaitForPageMs);

    page.evaluate(callbackResponsibleForCallPhantom);
}

/**
 * @param url {string}
 *          The url to load.
 * @param timeToWaitForPageMs {integer}
 *          The number of milliseconds to wait before admitting a timeout.
 * @param timeoutMessage {string}
 *          The message to show when timeout occurs. Make this relevant to your timeout logic.
 * @param callbackResponsibleForCallPhantom {function}
 *          A function responsible for calling window.callPhantom({html: your_html_value}) when the page is ready,
 *          according to your logic.
 */
function saveHtml(url, timeToWaitForPageMs, timeoutMessage, callbackResponsibleForCallPhantom) {
    page.open(url, function(status) {
        if (status === 'success') {
            waitForPageHtml(page, timeToWaitForPageMs, timeoutMessage, callbackResponsibleForCallPhantom);
        } else {
            phantom.exit();
        }
    });
}

exports.saveHtml = saveHtml;

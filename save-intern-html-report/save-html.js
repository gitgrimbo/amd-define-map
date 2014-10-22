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

function waitForPageHtml(page, opts) {
    setTimeout(function() {
        page.onCallback({
            timeout: true,
            message: opts.timeoutMessage
        });
    }, opts.timeToWaitForPageMs);

    if (opts.callbackArgs) {
        page.evaluate.apply(page, [opts.callbackResponsibleForCallPhantom].concat(opts.callbackArgs));
    } else {
        page.evaluate(opts.callbackResponsibleForCallPhantom);
    }
}

function defaultCallback() {
    if (typeof window.callPhantom === "function") {
        var html = document.documentElement.outerHTML;
        window.callPhantom({ html: html });
    }
}

/**
 * @param url {string}
 *          The url to load.
 * @param opts {object}
 *          The options object.
 * @param opts.timeToWaitForPageMs {integer}
 *          The number of milliseconds to wait before admitting a timeout.
 * @param opts.timeoutMessage {string}
 *          The message to show when timeout occurs. Make this relevant to your timeout logic.
 * @param opts.callbackResponsibleForCallPhantom {function}
 *          A function responsible for calling window.callPhantom({html: your_html_value}) when the page is ready,
 *          according to your logic.
 * @param opts.callbackArgs {array}
 *          The arguments that will be passed to the callback (used to pass node-side data to browser-side).
 */
function saveHtml(url, opts) {
    opts = opts || {};
    opts.timeToWaitForPageMs = opts.timeToWaitForPageMs || 5000;
    opts.timeoutMessage = opts.timeoutMessage || "Timeout";

    opts.callbackResponsibleForCallPhantom = opts.callbackResponsibleForCallPhantom || defaultCallback;

    page.open(url, function(status) {
        if (status === 'success') {
            waitForPageHtml(page, opts);
        } else {
            phantom.exit();
        }
    });
}

exports.saveHtml = saveHtml;

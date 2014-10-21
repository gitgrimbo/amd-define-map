// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define([
    'intern/node_modules/dojo/has'
], function(has) {
    var cfg = {
        useSauceConnect: false,

        environments: [],

        // Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
        // used here
        loader: {
            // Packages that should be registered with the loader in each testing environment
            packages: [
                { name: 'app', location: 'js' },
                { name: 'tests', location: 'tests' }
            ]
        },

        // Non-functional test suite(s) to run in each browser
        suites: [ 'tests/unit-tests' ],

        // A regular expression matching URLs to files that should not be included in code coverage analysis
        excludeInstrumentation: /^(node_modules|tests)[\\\/]/,

        reporters: [ 'console' ]
    };

    if (has("host-node")) {
        cfg.reporters = cfg.reporters.concat([ 'lcov', 'lcovhtml' ]);
    }

    if (has("host-browser")) {
        cfg.reporters = cfg.reporters.concat([ 'html' ]);
    }

    return cfg;
});

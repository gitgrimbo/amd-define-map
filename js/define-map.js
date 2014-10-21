/**
 * Basic attempt at implementing a define function that can take a map of dependency_alias->dependency_mid, and
 * resolve those dependencies into a 'resolved' map.
 *
 * E.g.
 *
 * <pre>
 * defineMap({
 *     lang: "dojo/_base/lang",
 *     relative: "./relative",
 *     module: "module",
 *     _: ["dojo/domReady!"]
 * }, function(deps) {
 *     console.log(deps.lang);
 *     console.log(deps.relative);
 *     console.log(deps.module.id);
 * });
 * </pre>
 *
 * Underscore can be used as a dependency_alias for modules you don't need a reference to.  The dependency_mid for
 * this can be a single mid string, or an array of mid strings.
 */
defineMap = function(mid, dependencies, factory) {
    var METH = "defineMap";
    var DEBUG = 0;

    // These are the arguments to be passed to define().
    var argsForDefine = arguments;

    function log() {
        if (DEBUG) {
            console.log.apply(console, [METH].concat([].slice.apply(arguments)));
        }
    }

    function isArray(it) {
        return "[object Array]" === Object.prototype.toString.apply(it);
    }

    function processDependencies(dependencies) {
        // Assume dependencies is an array of module ids, and set to mids.
        var mids = dependencies;

        // If dependencies is not an array (of module ids) then treat it as an object map of module aliases to module
        // ids. Remember the order of the module mids as well for when we come to resolve everything.
        var moduleNames = null;
        if (!isArray(dependencies)) {
            mids = [];
            moduleNames = [];
            for (var depAlias in dependencies) {
                var mid = dependencies[depAlias];
                if ("_" === depAlias) {
                    if ("string" === typeof mid) {
                        mids.push(mid);
                    } else {
                        // assume array
                        mids = mids.concat(mid);
                    }
                } else {
                    mids.push(mid);
                    moduleNames.push(depAlias);
                }
            }
        }
        return {
            mids: mids,
            moduleNames: moduleNames
        };
    }

    function handleMoreThanOneArgument() {
        if ("string" !== typeof mid) {
            // explicit module id not provided, shift args
            factory = dependencies;
            dependencies = mid;
            mid = null;
        }
        log("mid", mid, "dependencies", dependencies, "factory", factory);

        var processed = processDependencies(dependencies);
        var mids = processed.mids;
        var moduleNames = processed.moduleNames;

        log("mids", mids, "moduleName", moduleNames);

        function callback() {
            log("callback", "arguments", arguments);
            log("callback", "moduleNames", moduleNames);

            var moduleMap = null;

            if (moduleNames) {
                // moduleNames being defined means we want to use a moduleMap
                moduleMap = {};
                for (var i = 0; i < moduleNames.length; i++) {
                    moduleMap[moduleNames[i]] = arguments[i];
                }
            }
            if ("function" === typeof factory) {
                var args = moduleMap ? [moduleMap] : arguments;
                return factory.apply(null, args);
            } else {
                return factory;
            }
        }

        argsForDefine = mid ? [mid, mids, callback] : [mids, callback];
    }

    log("define", define);
    log("mid", mid, "dependencies", dependencies, "factory", factory);

    if (arguments.length !== 1) {
        handleMoreThanOneArgument();
    }

    log("args passed to define", argsForDefine);
    return define.apply(null, argsForDefine);
};

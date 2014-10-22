define([
    "require",
    "intern!object",
    "intern/chai!assert",
    "../js/define-map.js"
], function(require, registerSuite, assert) {

    var global = (function() { return this; }());

    /**
     * For most of the tests the same modules are loaded, so we can provide common assertion function.
     */
    function assertStandardTestDeps(deps, assertGlobalFlag) {
        // true unless explicitly false
        assertGlobalFlag = (assertGlobalFlag !== false);

        assert.isString(deps.module.id);
        assert.equal(deps.stringValueModule, "string-value-module");
        assert.equal(deps.text, "TEXT!");

        if (assertGlobalFlag) {
            assert.isTrue(global.amdDefineMapFlag);
        }
    }

    var tests = {
        "standard require": function() {
            var dfd = this.async(1000);
            require(["./string-value-module"], dfd.callback(function(stringValueModule) {
                assert.equal(stringValueModule, "string-value-module");
            }));
            return dfd.promise;
        },

        "require module-using-defineMap": function() {
            var dfd = this.async(1000);
            require(["./module-using-defineMap"], dfd.callback(function(moduleUsingDefineMap) {
                assertStandardTestDeps(moduleUsingDefineMap);
            }));
            return dfd.promise;
        },

        "require module-using-defineMap-and-explicit-mid": function() {
            var dfd = this.async(1000);
            require(["./module-using-defineMap-and-explicit-mid"], dfd.callback(function(moduleUsingDefineMap) {
                assertStandardTestDeps(moduleUsingDefineMap);
            }));
            return dfd.promise;
        },

        "require module-using-defineMap-no-deps-return-object": function() {
            var dfd = this.async(1000);
            require(["./module-using-defineMap-no-deps-return-object"], dfd.callback(function(moduleUsingDefineMap) {
                assert.isTrue(moduleUsingDefineMap.ok);
            }));
            return dfd.promise;
        },

        "require module-using-defineMap-has-deps-return-object": function() {
            var dfd = this.async(1000);
            require(["./module-using-defineMap-has-deps-return-object"], dfd.callback(function(moduleUsingDefineMap) {
                assert.isTrue(moduleUsingDefineMap.ok);
                assert.isTrue(global.amdDefineMapFlag);
            }));
            return dfd.promise;
        },

        "require module-using-defineMap-with-single-nonarray-unnamed-dep": function() {
            var dfd = this.async(1000);
            require(["./module-using-defineMap-with-single-nonarray-unnamed-dep"], dfd.callback(function(moduleUsingDefineMap) {
                assertStandardTestDeps(moduleUsingDefineMap);
            }));
            return dfd.promise;
        }
    };

    var suite = {
        name: "unit",

        // before each test executes
        beforeEach: function() {
            delete global.amdDefineMapFlag;
            // Module "module-that-sets-global.js" sets a global flag for some tests, so make sure it gets reset.
            require.undef(require.toAbsMid("./module-that-sets-global"));
        }
    };

    for (var n in tests) {
        suite[n] = tests[n];
    }

    registerSuite(suite);
});

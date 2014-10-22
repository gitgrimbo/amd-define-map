# What?

Basic attempt at implementing a define function that can take a map of dependency_alias->dependency_mid, and
resolve those dependencies into a 'resolved' map.

E.g.

````javascript
defineMap({
    lang: "dojo/_base/lang",
    relative: "./relative",
    module: "module",
    _: ["dojo/domReady!"]
}, function(deps) {
    console.log(deps.lang);
    console.log(deps.relative);
    console.log(deps.module.id);
});
````

The underscore character `"_"` can be used as a dependency_alias for modules you don't need a reference to.  The
dependency_mid for this can be a single MID (module id) string, or an array of MID strings.

# Why?

Using the standard `require`/`define` API, I constantly forget to add/remove a callback argument when I add/remove
a dependency MID.  The `defineMap` approach means I no longer have to worry about this.

For example, here is some sample code that is typical of my mistakes.

````javascript
define([
    "dependency1",
    "dependency2",
    "dependency3",
    "dependencyWithNoReturnValue"
], function(dep1, dep2, dep3) {
    ...
}
````

### Removing a dependency

I remove `"dependency2"`, but I forget to remove the callback parameter:

````javascript
define([
    "dependency1",
    "dependency3",
    "dependencyWithNoReturnValue"
], function(dep1, dep2, dep3) {
    ...
}
````

Now the `dep2` argument is assigned to the `"dependency3"` module, which is not what I want.

### Adding a dependency

I add a dependency, but I add it to the end of the dependency list because I have forgetten that one of the
dependencies had no callback parameter (because it didn't need one).

````javascript
define([
    "dependency1",
    "dependency2",
    "dependency3",
    "dependencyWithNoReturnValue",
    "dependency4"
], function(dep1, dep2, dep3, dep4) {
    ...
}
````

Now the `dep4` argument is assigned to the `"dependencyWithNoReturnValue"` module, which is not what I want, and
the "dependency4" module isn't assigned to any callback parameter.

# How does `defineMap()` help?

Rewriting the original sample using `defineMap()`:

````javascript
defineMap({
    dep1: "dependency1",
    dep2: "dependency2",
    dep3: "dependency3",
    _: "dependencyWithNoReturnValue"
}, function(deps) {
    ...
}
````

### Removing a dependency

I remove `"dependency2"` from the define map.

````javascript
defineMap({
    dep1: "dependency1",
    dep3: "dependency3",
    _: "dependencyWithNoReturnValue"
}, function(deps) {
    ...
}
````

Everything is fine, `"dependency2"` is no longer `require`d, and `deps` simply no longer contains a `dep3` property.

### Adding a dependency

I add `"dependency4"` to the define map (anywhere I like inside the map, order is unimportant).

````javascript
defineMap({
    dep3: "dependency4",
    dep1: "dependency1",
    dep2: "dependency2",
    dep3: "dependency3",
    _: "dependencyWithNoReturnValue"
}, function(deps) {
    ...
}
````

Everything is fine, `"dependency4"` is `require`d, and `deps` simply has an extra `dep4` property.

# Testing

[The Intern](http://theintern.io/) is used for testing.  The Intern lets us test from the command line and via the
browser.

### Command line

First, prepare your repo by installing the required dependencies:

<pre>npm install</pre>

Then run `npm test`:

<pre>
npm test

> amd-define-map@1.0.0 test d:\dev\git_repos\amd-define-map
> intern-client config=tests/intern

PASS: main - unit - standard require (0ms)
PASS: main - unit - require module-using-defineMap (0ms)
PASS: main - unit - require module-using-defineMap-and-explicit-mid (0ms)
PASS: main - unit - require module-using-defineMap-no-deps-return-object (0ms)
PASS: main - unit - require module-using-defineMap-has-deps-return-object (0ms)
PASS: main - unit - require module-using-defineMap-with-single-nonarray-unnamed-dep (10ms)
0/6 tests failed
0/6 tests failed

--------------------|-----------|-----------|-----------|-----------|
File                |   % Stmts |% Branches |   % Funcs |   % Lines |
--------------------|-----------|-----------|-----------|-----------|
   js\              |     98.11 |        80 |       100 |     98.11 |
      define-map.js |     98.11 |        80 |       100 |     98.11 |
--------------------|-----------|-----------|-----------|-----------|
All files           |     98.11 |        80 |       100 |     98.11 |
--------------------|-----------|-----------|-----------|-----------|
</pre>

After the test, you should also have an `lcov.info` file and a `code-coverage-report` folder.  The
`code-coverage-report` folder has an `index.html` page that can be viewed in a browser either from the file system:

file:///D/dev/git_repos/amd-define-map/code-coverage-report/index.html

or from a web server you start from the repo folder:

<http://localhost:8080/code-coverage-report/>

For example:

<http://gitgrimbo.github.io/amd-define-map/code-coverage-report/>

### Browser

The Intern has a `client.html` test runner that can be accessed via a web server started from the repo folder:

<http://localhost:8080/node_modules/intern/client.html?config=tests/intern>

The browser test does not produce an `lcov.info` file or `html-report` folder.

defineMap("MID", {
    module: "module",
    stringValueModule: "./string-value-module",
    text: "intern/dojo/text!./test.txt",
    _: ["./module-that-sets-global"]
}, function(deps) {
    return deps;
});

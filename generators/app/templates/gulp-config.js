module.exports = function() {
    var config = {
        websiteRoot: "C:\\inetpub\\wwwroot\\<%= solutionName %>.local\\Website",
        sitecoreLibraries: "C:\\inetpub\\wwwroot\\<%= solutionName %>.local\\Website\\bin",
        solutionName: "<%= solutionName %>",
        buildConfiguration: "Debug",
        runCleanBuilds: false
    }
    return config;
}
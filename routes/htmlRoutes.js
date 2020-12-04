var path = require("path");

//
// ROUTING
//

module.exports = function(app) {
    // Route for /notes to show the notes form
    app.get("/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/notes.html"));
        console.log (`User requested notes.html via "/notes" route.`);
    });

    // Default route if any other URL is selected to display the index.html page
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
        console.log (`User requested index.html via "*" route.`);
    });
}
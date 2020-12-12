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

    // Deliver the index.html file if the / directory is selected.  This would also be delivered with the last
    // route if the user specified /index.html
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
        console.log (`User requested index.html via "/" route.`);
    });

    // Default route to deliver any other file.  This is here to handle the CSS and JavaScript requests
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, `../public${req.url}`));
        console.log (req.url);
        console.log (`User requested index.html via "*" route.`);
    });

}
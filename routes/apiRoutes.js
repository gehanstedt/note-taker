

var nextNoteID = 4;
var notes = [
    {
      id: 0,
      title: "Note 0",
      text: "Note 0 text"
    },
    {
      id: 1,
      title: "Note 1",
      text: "Note 1 text"
    },
    {
      id: 2,
      title: "Note 2",
      text: "Note 2 text"
    },
    {
      id: 3,
      title: "Note 3",
      text: "Note 3 text"
    },
  ];
  
  var waitList = [];

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
    // API GET Requests
    // Displays JSON of all reservations
    app.get("/api/notes", function(req, res) {
        console.log (`User requested notes JSON via "/api/notes" route.`);
        return res.json(notes);
    });
  
    // Displays JSON of waitlist
    app.get("/api/waitlist", function(req, res) {
        return res.json(waitList);
    });
  
    // Clear all reservations and waitlist
    app.post("/api/clear", function(req, res) {
        console.log ("Clearing both reservations and waitList");
        waitList = [];
        reservations = [];
        return res.json(true);
    });
  
    // Create New Reservation - takes in JSON input
    app.post("/api/notes", function(req, res) {
        // req.body hosts is equal to the JSON post sent from the user
        // This works because of our body parsing middleware
        var noteObject = req.body;
    
        // Using a RegEx Pattern to remove spaces from newCharacter
        // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
        // newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();
    
        console.log(noteObject);

        noteObject.id = parseInt (noteObject.id);
        if (noteObject.id === -1) {
          noteObject.id = nextNoteID;
          notes.push (noteObject);
        }

        else {
          notes [noteObject.id].title = noteObject.title;
          notes [noteObject.id].text = noteObject.text;
        }

        console.log (notes);
/*
        console.log (`Reservations length: ${reservations.length}`);
    
        if (reservations.length < 5) {
        reservations.push(newReservation);
        console.log ("Reservation table:");
        console.log (reservations);
        res.json (true);
        }
    
        else {
        waitList.push (newReservation);
        console.log ("Waitlist table:");
        console.log (waitList);
        res.json (false);
        }
*/
    });
}
  
  
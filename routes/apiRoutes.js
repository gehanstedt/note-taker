const fs = require("fs");
const { json } = require("express");
const filename = "./db/db.json"

// Load notes from JSON database file and set next note ID to be one greater than the ID stored in the last note
var notes = JSON.parse(fs.readFileSync(filename, "utf8"));
var nextNoteID = notes[notes.length - 1].id + 1;



// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
    var counter;
    // API GET Requests
    // Displays JSON of all notes
    app.get("/api/notes", function(req, res) {
        console.log (`User requested notes JSON via "/api/notes" route.`);
        return res.json(notes);
    });
  
    // Delete a specific note and remove from the notes object
    app.delete("/api/notes/:id", function(req, res) {
      var idToDelete = parseInt (req.params.id);
      console.log (`User requested "/api/notes/${idToDelete} via DELETE route.`);
      console.log (`ID to be deleted:  ${idToDelete}`);

      for (counter = 0; counter < notes.length; counter ++) {
        if (notes[counter].id === idToDelete) {
          notes.splice (counter, 1);
        }
      }

      // Write note object to disk
      fs.writeFileSync(filename, JSON.stringify(notes), function(err) {
        if (err) throw (err);        
      }); 

      return res.json(true);
    });

    // Add or update a note.  If the ID returned is -1, add as a new note.  If not, update
    // note with that returned ID
    app.post("/api/notes", function(req, res) {
      var noteObject = req.body;

      console.log (`User requested /api/notes via POST route.`);
    
      console.log(noteObject);

      noteObject.id = parseInt (noteObject.id);

      // If the ID from the browser is -1, push the new note to the notes object
      if (noteObject.id === -1) {
        noteObject.id = nextNoteID;
        notes.push (noteObject);
        nextNoteID++;
      }

      // Note ID was not -1 to add a new note, so just update the note 
      else {
        notes [noteObject.id].title = noteObject.title;
        notes [noteObject.id].text = noteObject.text;
      }

      console.log (notes);

      // Write note object to disk
      fs.writeFileSync(filename, JSON.stringify(notes), function(err) {
        if (err) throw (err);        
      }); 

      res.json (noteObject.id);
    });
}
  
  
var selectedNoteID = -1;
var externalTableData;

// Define $.delete method
$.delete = function(url, data, callback){
 
  if ( $.isFunction(data) ){
    type = 'DELETE' || callback,
        callback = data,
        data = {}
  }
 
  return $.ajax({
    url: url,
    type: 'DELETE',
    success: callback,
    data: data,
    contentType: 'DELETE'
  });
}

$(document).ready(function() {

  // Function to remove the note titles
  function emptyNoteTitles () {
      $("#noteTitlesGoHere").empty ();
  }

  // Function to clear the text from note title and text, as well as reset current note ID to -1
  function clearCurrentNote () {
    selectedNoteID = -1;
    $(".inputNoteTitle").val ("");
    $(".inputNoteText").val ("");
    showSaveIcon ();
  }

  // Function to hide the save icon
  function hideSaveIcon () {
    $("#saveIcon").attr ("style", "display: none");
  }

  // Function to show the save icon
  function showSaveIcon () {
    $("#saveIcon").attr ("style", "display: inline");
  }

  // Function to load the node details of the selected ID and display in the main title and text fields
  function loadNoteDetails (id) {
    var counter = 0;
    console.log (`loadNoteDetails -->  ID: ${id}`);

    for (counter = 0; counter < externalTableData.length; counter ++) {
      if (externalTableData[counter].id === id) {
        $(".inputNoteTitle").val (externalTableData[counter].title);
        $(".inputNoteText").val (externalTableData[counter].text);
      }
    }
    showSaveIcon ();
  }

  // Display the note titles into the left menu
  function renderNoteTitles (tableData) {
    const notesTarget = $("#noteTitlesGoHere");
    var counter;
    var aElement;
    var liElement;
    var iElement;

    // Clear the current note titles
    emptyNoteTitles ();

    // For each of the notesTarget, create appropriate HTML to display the title as well as the delete icon
    for (counter = 0; counter < tableData.length; counter ++) {
      liElement = $(`<li class="list-group-item list-group-item-action">`);
      notesTarget.append (liElement);
      aElement = $(`<a href="#" class="noteList" noteid="${tableData[counter].id}">`);
      aElement.text (`${tableData[counter].title}`);
      liElement.append (aElement);
      iElement = $(`<i class="fas fa-trash-alt float-right deleteNote" noteid="${tableData[counter].id}">`);
      liElement.append (iElement);
    }
  }

  // This function handles the overall retrieval of notes from the server via a GET.  
  // It will then call the render title function, and if a note is selected, the note detail functions
	function displayNotes (){
		// Here we get the location of the root page.
		// We use this instead of explicitly saying the URL is localhost:3001 because the url will change when we deploy.
		var currentURL = window.location.origin;

		// The AJAX function uses the URL of our API to GET the data associated with it (initially set to localhost)
		$.ajax({url: currentURL + "/api/notes", method: "GET"})
			.done(function(tableData) {

				// Here we are logging the URL so we have access to it for troubleshooting
				console.log("------------------------------------");
				console.log("URL: " + currentURL + "/api/notes");
        console.log("------------------------------------");
        
        externalTableData = tableData;

				// Here we then log the NYTData to console, where it will show up as an object.
				console.log(tableData);
        console.log("------------------------------------");
        
        // Render titles to left menu
        renderNoteTitles (tableData);

        // If this is NOT a new note, display title and text associated with that note ID
        if (selectedNoteID != -1) {
          loadNoteDetails (selectedNoteID);
        }
		});
  }


  // Handle click of any of the notes (but not the delete)
  // THis will call loadNoteDetails to display the appropriate title and text for that note
  $("#noteTitlesGoHere").on ("click", ".noteList", function (event) {
    event.preventDefault ();
    
    selectedNoteID = parseInt ($(this).attr("noteid"));

    loadNoteDetails (selectedNoteID);
  });

  // Handle click of the delete icon of a note
  // Make a HTTP DELETE call back to the server with the ID to delete the note
  // Then display the notes
  $("#noteTitlesGoHere").on ("click", ".deleteNote", function (event) {
    var noteIDtoDelete;
    console.log(this);

    event.preventDefault ();
    
    noteIDtoDelete = parseInt ($(this).attr("noteid"));
    console.log ("Delete ID selected:  " + noteIDtoDelete);

    var currentURL = window.location.origin;
    var dataPayload = {
                        id: noteIDtoDelete
    };
    
    $.delete(`${currentURL}/api/notes/${noteIDtoDelete}`, dataPayload, 
    function (data) {
      console.log (`Data:  ${data}`);
      
      // If we deleted the current note, let's reset and display a blank note
      if (noteIDtoDelete === selectedNoteID) {
        clearCurrentNote ();
      }
      displayNotes ();
    });
  });

  $("#createNewNoteLink").on ("click", function (event) {
    clearCurrentNote ();
  });  

  $("#saveIcon").on ("click", function (event) {
    console.log ("Save icon clicked");
    var currentURL = window.location.origin;
    var dataPayload = {
                        id: selectedNoteID,
                        title: $(".inputNoteTitle").val ().trim (),
                        text: $(".inputNoteText").val ().trim ()
    }; 
    
    console.log (dataPayload);
    
		// The AJAX function uses the URL of our API to GET the data associated with it (initially set to localhost)
    $.post(currentURL + "/api/notes", dataPayload,
    function (data) {
      console.log (`Data:  ${data}`);
      selectedNoteID = parseInt (data);
      displayNotes ();
      console.log (`Note ID: ${selectedNoteID}`);
//      loadNoteDetails (selectedNoteID);;
    });
  });  

  showSaveIcon ();
  displayNotes ();

});



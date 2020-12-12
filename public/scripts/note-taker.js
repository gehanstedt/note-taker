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

  // Empty the schedule to prepare for loading the schedule from JavaScript
  function emptyNoteTitles () {
      $("#noteTitlesGoHere").empty ();
  }

  function clearCurrentNote () {
    selectedNoteID = -1;
    $(".inputNoteTitle").val ("");
    $(".inputNoteText").val ("");
    showSaveIcon ();
  }

  function hideSaveIcon () {
    $("#saveIcon").attr ("style", "display: none");
  }

  function showSaveIcon () {
    $("#saveIcon").attr ("style", "display: inline");
  }

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

  function renderNoteTitles (tableData) {
    const notesTarget = $("#noteTitlesGoHere");
    var counter;
    var aElement;
    var liElement;
    var iElement;
    emptyNoteTitles ();

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

	function displayNotes (){
		// Here we get the location of the root page.
		// We use this instead of explicitly saying the URL is localhost:3001 because the url will change when we deploy.
		var currentURL = window.location.origin;

		// The AJAX function uses the URL of our API to GET the data associated with it (initially set to localhost)
		$.ajax({url: currentURL + "/api/notes", method: "GET"})
			.done(function(tableData) {

				// Here we are logging the URL so we have access to it for troubleshooting
				console.log("------------------------------------");
				console.log("URL: " + currentURL + "/api/reservations");
        console.log("------------------------------------");
        
        externalTableData = tableData;

				// Here we then log the NYTData to console, where it will show up as an object.
				console.log(tableData);
        console.log("------------------------------------");
        
        renderNoteTitles (tableData);
        if (selectedNoteID != -1) {
          loadNoteDetails (selectedNoteID);
        }
		});
  }



  $("#noteTitlesGoHere").on ("click", ".noteList", function (event) {
    event.preventDefault ();
    
    selectedNoteID = parseInt ($(this).attr("noteid"));

    loadNoteDetails (selectedNoteID);
  });

  $("#noteTitlesGoHere").on ("click", ".deleteNote", function (event) {
    console.log(this);

    event.preventDefault ();
    
    selectedNoteID = parseInt ($(this).attr("noteid"));
    console.log ("Delete ID selected:  " + selectedNoteID);

    var currentURL = window.location.origin;
    var dataPayload = {
                        id: selectedNoteID
    };
    
    $.delete(`${currentURL}/api/notes/${selectedNoteID}`, dataPayload, 
    function (data) {
      console.log (`Data:  ${data}`);
    });

    displayNotes ();

    // Clear all reservations and waitlist
/*
    $.get(`${currentURL}/api/notes/${selectedNoteID}`, dataPayload, 
    function (data) {
      console.log (`Data:  ${data}`);
    });
*/

/*
    $.ajax({
      type: 'POST',
      headers: { 'X_METHODOVERRIDE': 'DELETE' },
      url: currentURL + "/api/notes",
      data: dataPayload,
      success: function () {
        console.log (`DELETE Note ID ${selectedNoteID} deleted`);
      }});
*/

      
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



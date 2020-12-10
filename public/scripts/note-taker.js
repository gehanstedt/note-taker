var selectedNote;
var externalTableData;

$(document).ready(function() {

  // Empty the schedule to prepare for loading the schedule from JavaScript
  function emptyNoteTitles () {
      $("#noteTitlesGoHere").empty ();
  }

  function hideSaveIcon () {
    $("#saveIcon").attr ("style", "display: none");
  }

  function showSaveIcon () {
    $("#saveIcon").attr ("style", "display: inline");
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
		});
  }

  $("#noteTitlesGoHere").on ("click", ".noteList", function (event) {
    event.preventDefault ();
    var idSelected;

    idSelected = $(this).attr("noteid");
    console.log ("ID selected:  " + idSelected);

    $(".inputNoteTitle").val (externalTableData[idSelected].title);
    $(".inputNoteText").val (externalTableData[idSelected].text);
  });

  $("#noteTitlesGoHere").on ("click", ".deleteNote", function (event) {
    console.log(this);

    event.preventDefault ();
    var idSelected;

    idSelected = $(this).attr("noteid");
    console.log ("Delete ID selected:  " + idSelected);
  });

  hideSaveIcon ();
  displayNotes ();

});



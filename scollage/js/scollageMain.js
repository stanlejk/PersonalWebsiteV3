/**
 *  JavaScript functions for main.jsp
 */

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();
// Array of saved urls for gallery display
var galleryImageUrls = [];
// Array of database keys for saved images
var galleryImageDatabaseKeys = [];

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Don't do anything if user is signed in
	} else {
		// No user is signed in.
		window.location.href = "login.jsp";
	}
});

/* Function to log out user */
document.querySelector("#logOutBtn").onclick = function() {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		console.log("log out successful");
		window.location.href = "login.jsp";
	}).catch(function(error) {
		// An error happened.
		alert("Something went wrong with log out")
	});
}

/* Function to display options */
document.querySelector("#collageOptionsBtn").onclick = function() {
	var options = document.getElementById("optionsMenu");
	var button = document.getElementById("collageOptionsBtn");
	//classToChange.classList.toggle("optionsMenuShown");
	if (button.innerHTML == " Collage Options "){
		console.log("test");
		options.setAttribute('class', 'optionsMenuShown');
		button.innerHTML = " Hide ";
	}
	else {
		options.setAttribute('class', 'optionsMenu');
		button.innerHTML = " Collage Options ";
	}
}

/* Function to populate collage display */
document.querySelector("#buildCollageBtn").onclick = function() {
	if ((document.querySelector("#shapeBox").value != '') && (document.querySelector("#topicBox").value != '')) {
		console.log("build collage button pressed");
		document.querySelector("#wrapper").innerHTML = "<div id='maxSizeCollageContainer'> <div id='collageContainer' class='row'> <div id='collageDisplay' class='item'> <div class='loader'></div></div></div></div>";
		/* This is where we need to send data to the servlet and generate the letter shaped collage */
		var topicString = document.querySelector("#topicBox").value;
		var shapeString = document.querySelector("#shapeBox").value;
		var bordersOption = document.querySelector("#borderBox").checked;
		var rotateOption = document.querySelector("#rotateBox").checked;
		var width = document.querySelector("#widthBox").value;
		var height = document.querySelector("#heightBox").value;
		var filter = document.querySelector("#filterValue").value;
		var xhttp = new XMLHttpRequest();

		xhttp.open("GET", "http://localhost:8080/310_Project2"+"/CollageBuilderServlet?topic="+topicString+"&shape="+shapeString+"&borders="+bordersOption+"&rotate="+rotateOption+"&width="+width+"&height="+height+"&filter="+filter, true);
		xhttp.send();

		//use this for animated busy symbol - state to indicate ready
		xhttp.onreadystatechange = function() {
			if (xhttp.responseText.length > 0){
				document.querySelector("#collageDisplay").innerHTML = "<img id='collageImage' src=''>";
				document.querySelector("#collageImage").src = xhttp.responseText;
				if (document.querySelector("#widthBox").value > 500) {
					alert("Value greater than 500px")
				} else {
					document.querySelector("#collageImage").style.width = document.querySelector("#widthBox").value + 'px';
				}

				if (document.querySelector("#heightBox").value > 500) {
					alert("Value greater than 500px");
				} else {
					document.querySelector("#collageImage").style.height = document.querySelector("#heightBox").value + 'px';
				}

				document.querySelector("#collageImage").style.filter = document.getElementById("filterValue").value;
				document.querySelector("#saveBtns").style.visibility = "visible";
				document.querySelector("#widthSubmit").style.visibility = "visible";
				document.querySelector("#heightSubmit").style.visibility = "visible";
			}
		};
	} else {
		alert("Please ensure both shape and topic are given")
	}
}

/* Function to save currently displayed collage to history (database) */
document.querySelector("#saveToHistoryBtn").onclick = function() {
	if (document.querySelector("#collageImage").getAttribute('src') == "") {
		console.log("ERROR: save to history button pressed when no collage present");
		/* If the src attribute is empty, this section of code should not be reachable */
	} else {
		/* Create reference to uploaded image */
		var collageRef = storageRef.child(document.querySelector("#topicBox").value + '.png');
		/* Save the Base64 formatted string to the database */
		var image = document.querySelector("#collageImage").src;
		/* Create metadata */
		var metadata = {	 contentType: 'image/png' };
		/* Variable for upload task to track status of upload */
		collageRef.putString(image, 'data_url', metadata).then(function(snapshot){
			var newPostKey = firebase.database().ref('savedCollages').push().key;
			firebase.database().ref('savedCollages/' + newPostKey).set({
				email: firebase.auth().currentUser.email,
				collageURL: snapshot.downloadURL,
				key: newPostKey
			});
			updateGalleryArray();
		}).catch(function(error) {
			console.log("No URL");
			console.log(error);
		});
	}
}

/* Function to update history gallery array */
function updateGalleryArray() {
	/* Clear the gallery images so we don't double push */
	galleryImageUrls = [];
	galleryImageDatabaseKeys = [];
	firebase.database().ref().child('savedCollages').once("value").then(function(snapshot) {
		for (var key in snapshot.val()) {
			/* If the email of image matches current user, push to gallery array */
			if (snapshot.val()[key].email === firebase.auth().currentUser.email){
				var dbKey = snapshot.val()[key].key;
				galleryImageDatabaseKeys.push(dbKey);
				var url = snapshot.val()[key].collageURL;
				galleryImageUrls.push(url);
			}
		}
		for (var keyIndex in galleryImageDatabaseKeys) {
			console.log("dbKey: " + galleryImageDatabaseKeys[keyIndex]);
		}
		updateGallery();
	});
}

/* Function to switch collage clicked with main display, attached to each obj in gallery */
function swapCollage() {
	document.querySelector("#collageImage").src = this.src;
}

/* Function to delete a collage from saved history */
function deleteCollageFromHistory() {
	firebase.database().ref().child("savedCollages").child(this.getAttribute("data-key")).remove();
	var deleteRef = firebase.storage().refFromURL(this.getAttribute("data-imageURL"));
	deleteRef.delete();
	updateGalleryArray();
}

/* Function to update history gallery array */
function updateGallery() {
	var collageHistoryGalleryContainer = document.getElementById("collageHistoryGalleryContainer");
	while (collageHistoryGalleryContainer.firstChild) {
		collageHistoryGalleryContainer.removeChild(collageHistoryGalleryContainer.firstChild);
	}
	for (var index = 0; index < galleryImageDatabaseKeys.length; index++) {
		var collageImageContainer = document.createElement("div");
		collageImageContainer.setAttribute("class", "collageHistoryImageContainer");

		var collageImageElement = document.createElement("IMG");
		collageImageElement.setAttribute("src", galleryImageUrls[index]);
		collageImageElement.setAttribute("class", "collageHistoryImage");
		collageImageElement.onclick = swapCollage;

		var collageDeleteFromHistoryButton = document.createElement("i");
		collageDeleteFromHistoryButton.setAttribute("class", "material-icons collageDeleteButton");
		collageDeleteFromHistoryButton.setAttribute("data-key", galleryImageDatabaseKeys[index]);
		collageDeleteFromHistoryButton.setAttribute("data-imageURL", galleryImageUrls[index]);
		collageDeleteFromHistoryButton.appendChild(document.createTextNode("clear"));
		collageDeleteFromHistoryButton.onclick = deleteCollageFromHistory;

		collageImageContainer.appendChild(collageImageElement);
		collageImageContainer.appendChild(collageDeleteFromHistoryButton);
		collageHistoryGalleryContainer.appendChild(collageImageContainer);
	}
}

/* Allows submit buttons to be triggered when the user presses 'enter' */
document.getElementById("widthBox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("widthSubmit").click();
    }
});

document.getElementById("heightBox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("heightSubmit").click();
    }
});

document.getElementById("topicBox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("buildCollageBtn").click();
    }
});

document.getElementById("shapeBox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("buildCollageBtn").click();
    }
});

/*Save collage as PNG */
document.querySelector("#exportBtnPng").onclick = function() {
	var image = document.querySelector("#collageImage").src;
	var topicString = document.querySelector("#topicBox").value;

	var a = document.createElement('a');
	a.id = "asPng";
	a.href = image;
	a.download = topicString + ".png";
	a.click();

}

/*Save collage as PDF */
document.querySelector("#exportBtnPdf").onclick = function() {
	var image = document.querySelector("#collageImage").src;
	var topicString = document.querySelector("#topicBox").value;
	var width = document.querySelector("#widthBox").value;
	var height = document.querySelector("#heightBox").value;

	var doc = new jsPDF();
	doc.addImage(image, 'PNG', 15, 40, width, height);
	doc.save(topicString + '.pdf');
}

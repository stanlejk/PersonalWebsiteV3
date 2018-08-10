/**
 *
 */

var config = {
	apiKey: "AIzaSyC6ClUVqUFLcfXz8LZYZ0Fg1WpyRn1p-2Q",
	authDomain: "cs310-p2groupn.firebaseapp.com",
	databaseURL: "https://cs310-p2groupn.firebaseio.com",
	projectId: "cs310-p2groupn",
	storageBucket: "cs310-p2groupn.appspot.com"
};

firebase.initializeApp(config);

var rootRef = firebase.database().ref();

document.getElementById("acct_button").onclick = function() {
	console.log("log in button clicked");

	var email = document.querySelector("#emailinput").value;
	var password = document.querySelector("#passinput").value;

	if (email == "" && password == "") {

		alert("Please enter an email and password")
		return;
	} else if (email == "") {
		alert("Please enter an email")
		return;
	} else if (password == "") {
		alert("Please enter a password")
		return;
	}

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

		alert("Incorrect username or password")
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
		console.log(error.code + errorMessage);
	});

}

document.getElementById("register_button").onclick = function() {

	console.log("register button clicked");
	var email = document.querySelector("#newemail").value;
	var password = document.querySelector("#newpw").value;
	var confirmPassword = document.querySelector("#confirmpw").value;

	if (password != confirmPassword) {
		// OUTPUT ERROR HERE
		console.log("passwords do not match");
		alert("Passwords do not match!");
	}
	else {
		console.log("creating user");
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
			console.log(error.code + errorMessage);
			alert(error.code + " " + errorMessage);
		});
	}
}

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		window.location.href = "scollageMain.html";
	} else {
		// No user is signed in.
		console.log("could not sign in");
	}
});

function newUserFunc() {
	document.getElementById("outercontainer").style.display = "none";
	document.getElementById("register").style.display = "none";
	document.getElementById("newUserClick").style.display = "none";
	document.getElementById("newusercontainer").style.display = "block";
}

function toggleShowError() {
	var errorContainer = document.getElementById("errorcontainer");
	if (errorContainer.style.display == "none") {
		errorContainer.style.display = "block";
	}
	else {
		errorContainer.style.display = "none";
	}
}

/* Allows submit buttons to be triggered when the user presses 'enter' */
document.getElementById("emailinput").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("acct_button").click();
    }
});

document.getElementById("passinput")
	.addEventListener("keyup", function(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
	    document.getElementById("acct_button").click();
	}
});

/* Back button to return to login from registration */
document.getElementById("back_button").onclick = function() {
	document.getElementById("outercontainer").style.display = "block";
	document.getElementById("newusercontainer").style.display = "none";
}

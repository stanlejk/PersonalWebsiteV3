<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<!-- Google font -->
		<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
		<!-- Bootstrap -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
		<link rel="stylesheet" href="css/scollageMain.css" type="text/css">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js"></script>
		<title> Main Web Page </title>
	</head>
	<body onload="updateGalleryArray();">
	<div id= "topContainer">
		<button id="logOutBtn" class="btn btn-secondary"> Log Out </button>
	</div>
	<br><br><br><br>
		<div id="container">
			<div id="leftContainer">
				<div class="horizRow">
					<label for="topicBox"> Topic </label>
					<input id="topicBox" type="text">
				</div>
				<div class="horizRow">
					<label for="topicBox"> Shape </label>
					<input id="shapeBox" type="text">
				</div>
				<button id="buildCollageBtn" type="submit" class="btn btn-info"> Build Collage </button>
				<button id="collageOptionsBtn" class="btn btn-info"> Collage Options </button>
				<div id = "optionsMenu" class="optionsMenu">
					<div class="horizRow">
						<label for="dropdownContainer"> Filter </label>
						<div id="dropdownContainer">
						<select id="filterValue" onchange="filter()">
						  <option value="none"> Normal </option>
						  <option value="grayscale100">Black & White </option>
						  <option value="sepia">Sepia</option>
						  <option value="grayscale50">Grayscale</option>
						</select>
						</div>
					</div>


					<div class="horizRow">
						<label for="borderBox"> Borders </label>
						<input id="borderBox" type="checkbox">
					</div>
					<div class="horizRow">
						<label for="rotateBox"> Rotation </label>
						<input id="rotateBox" type="checkbox">
					</div>
					<div class="horizRow">
						<label for="widthBox"> Width </label>
						<input id="widthBox" type="text" placeholder="Max 500px">
						<button id="widthSubmit" type="submit"> Update </button>
					</div>
					<div class="horizRow">
						<label for="heightBox"> Height </label>
						<input id="heightBox" type="text" placeholder="Max 500px">
						<button id="heightSubmit" type="submit"> Update </button>
					</div>
				</div>

			</div>
			<div id="wrapper">
				<div id="filler">
					<h1 class="fillertext" id="filler_one"> Customize </h1>
					<h1 class="fillertext" id="filler_two"> Your </h1>
					<h1 class="fillertext" id="filler_three"> Collage </h1>
				</div>
			</div>
			<div id="saveBtns">
				<button id="saveToHistoryBtn" class="save btn btn-primary"> Save to History  </button>
				<button id="exportBtnPng" class="save btn btn-primary"> Export as PNG</button>
				<button id="exportBtnPdf" class="save btn btn-primary"> Export as PDF</button>
			</div>
		</div>
		<!-- Container for Collage History Gallery -->
		<div id="collageHistoryGalleryContainer">
		</div>

		<!-- Include Firebase -->
		<script src="https://www.gstatic.com/firebasejs/4.12.0/firebase.js"></script>
		<!-- Initialize Firebase -->
		<script>
			// Set up the configuration for firebase app
			var config = {
				apiKey: "AIzaSyC6ClUVqUFLcfXz8LZYZ0Fg1WpyRn1p-2Q",
				authDomain: "cs310-p2groupn.firebaseapp.com",
				databaseURL: "https://cs310-p2groupn.firebaseio.com",
				projectId: "cs310-p2groupn",
				storageBucket: "cs310-p2groupn.appspot.com",
			};
			firebase.initializeApp(config);

			// Get a reference to the database service
			var database = firebase.database();
			// Get a reference to the storage service, which is used to create references in your storage bucket
		  	var storage = firebase.storage();
			// Create a storage reference from our storage service
		  	var storageRef = storage.ref();
		</script>

		<script type="text/javascript" src="js/scollageMain.js">
		</script>
	</body>
</html>

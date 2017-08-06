// Firebase Initialize for this web app
// ==============================================================
$(document).ready(function() {
	var config = {
	apiKey: "AIzaSyBQStQfYjji2Aet-o24sUSMGN-MMvOmloU",
    authDomain: "train-scheduler-16c2a.firebaseapp.com",
    databaseURL: "https://train-scheduler-16c2a.firebaseio.com",
    projectId: "train-scheduler-16c2a",
    storageBucket: "train-scheduler-16c2a.appspot.com",
    messagingSenderId: "805614261728"

	};
	firebase.initializeApp(config); // Initialize the Firebase App

// Variables
// ==============================================================
var database = firebase.database();
var name;
var destination;
var time;
var frequency;
// ==============================================================

// Button Click Action!!
// =============================================================
$("#submit").on("click", function(){

	var name = $('#nameInput').val().trim();
	var destination = $('#destinationInput').val().trim();
	var time = $('#timeInput').val().trim();
	var frequency = $('#frequencyInput').val().trim();

// Firebase Push
	database.ref().push({
		name: name,
		destination: destination,
		time: time,
		frequency: frequency,
		timeAdded: firebase.database.ServerValue.TIMESTAMP
	}); // end database.ref().push()

	$("input").val(' ');
	return false;

}); // end $("#submit").on("click", function())

// Implementaion of function(childSnapshot) from Firebase
database.ref().on("child_added", function(childSnapshot) {
		var name = childSnapshot.val().name;
		console.log("Name: " + name);

		var destination = childSnapshot.val().destination;
		console.log("Destination: " + destination);

		var time = childSnapshot.val().time;
		console.log("Time: " + time);

		var frequency = childSnapshot.val().frequency;
		console.log("Frequency: " + frequency);

		var frequency = parseInt(frequency);

		// Implenting moment.js
		var currentTime = moment();

		// Time conversions, because apperantly the time data gathered from moment.js has to be
		// converted or it will be incorrect
		// ===============================================================================
		var destConv = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'Years');
		var trainTime = moment(destConv).format('HH:mm');
		var timeConv = moment(trainTime, 'HH:mm').subtract(1, 'Years');
		var timeDiff = moment().diff(moment(timeConv), 'Minutes');
		var timeRemain = timeDiff % frequency;
		var minsAway = frequency - timeRemain;
		var nextTrain = moment().add(minsAway, 'Minutes');

	$('#currentTime').text(currentTime);

	$('#trainTable').append(

		// Data added to the train table made in the HTML file
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name + 
		"</td><td id='destinationDisplay'>" + childSnapshot.val().destination + 
		"</td><td id='frequencyDisplay'>" + childSnapshot.val().frequency + ' Minutes' +
		"</td><td id='nextArrivalDisplay'>" + moment(nextTrain).format("HH:mm") + 
		"</td><td id='timeOutDisplay'>" + minsAway  + "</td></tr>");

}); // end database.ref().on("child_added", function(childSnapshot)

}); // end $(document).ready(function()
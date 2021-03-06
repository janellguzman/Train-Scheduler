// Initialize Firebase
var config = {
    apiKey: "AIzaSyC25YvinxY0INoEvD70fizjTKW9tcqShDc",
    authDomain: "train-scheduler-jg.firebaseapp.com",
    databaseURL: "https://train-scheduler-jg.firebaseio.com",
    projectId: "train-scheduler-jg",
    storageBucket: "",
    messagingSenderId: "669259784178"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs information from user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainTime = moment($("#time-input").val().trim(), "HH:mm").subtract(1, 'years').format("HH:mm");
    var trainFrequency = $("#frequency-input").val().trim();

    // Created for holding train data in a local temporary object
    var newTrain = {
        trainName: trainName,
        destination: trainDestination,
        startTime: trainTime,
        frequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs inputs into the console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.startTime);
    console.log(newTrain.frequency);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");

});

// Creates Firebase event for adding trains to the database and inserting a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Stores everything into a variable
    var trainName = childSnapshot.val().trainName;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().startTime;
    var trainFrequency = childSnapshot.val().frequency;

    // Current time
    var trainTime = moment();
    var diffTime = moment().diff(moment.unix(trainTime), "minutes");

    // Time remaining
    var timeRemaining = moment().diff(moment.unix(trainTime), "minutes") % trainFrequency;
    var minutes = trainFrequency - timeRemaining;
    var nextTrain = moment().add(minutes, "m").format("HH:mm A");

    console.log(minutes);
    console.log(nextTrain);

    // Adds each train's data into the time
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
        trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minutes + "</td></tr>");

    // Handles the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

});
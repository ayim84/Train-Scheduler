$(document).ready(function () 
{
    /*** Initialize Firebase ***/

    var config = {
        apiKey: "AIzaSyAq4yerWRu-IS27tvd4w7BZYWgS9d_-tPg",
        authDomain: "train-scheduler-f60a3.firebaseapp.com",
        databaseURL: "https://train-scheduler-f60a3.firebaseio.com",
        projectId: "train-scheduler-f60a3",
        storageBucket: "train-scheduler-f60a3.appspot.com",
        messagingSenderId: "777387452322"
    };
        
    firebase.initializeApp(config);

    /*************************/
    
    var database = firebase.database();
    
    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";
    
    $("#addTrain").on("click", function(event)
    {
        event.preventDefault();
       
        trainName = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        trainTime = $("#trainTimeInput").val().trim();
        frequency = $("#frequencyInput").val().trim();

        console.log(trainTime);

        /*** Moment.js math to calculate Next Arrival & Minutes Away (Needs work) ***/

        var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
        console.log(moment(trainTime, "HH:mm"));
        console.log("FIRST TIME CONVERTED: " + firstTimeConverted);

        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        var timeRemainder = diffTime % frequency;
        console.log(timeRemainder);
       
        var minutesUntilTrain = frequency - timeRemainder;
        console.log("MINUTES TILL TRAIN: " + minutesUntilTrain);

        var nextTrain = currentTime.add(minutesUntilTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        var nextArrival = moment(nextTrain).format("hh:mm");

        /***************************************************************************/

        /*** Push Train Schedule Values to Firebase ***/

        database.ref().push(
        {
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            nextArrival: nextArrival,
            minutesUntilTrain: minutesUntilTrain
        });

        /**********************************************/

        /*** Clear Form after Submission ***/

        $("#trainNameInput, #destinationInput, #trainTimeInput, #frequencyInput").val("");

        /***********************************/
       
    });

    /*** Add table row when page is loaded and data is added to Firebase ***/

    database.ref().on("child_added", function(snapshot)
    {
        var newRow = $("<tr>");

        newRow.append
        (
            $("<td>").text(snapshot.val().trainName),
            $("<td>").text(snapshot.val().destination),
            $("<td>").text(snapshot.val().frequency),
            $("<td>").text(snapshot.val().nextArrival),
            $("<td>").text(snapshot.val().minutesUntilTrain)
        );

        $("#tableRows").prepend(newRow);

    }, function(errorObject) 
    {
        console.log("Errors handled: " + errorObject.code);
    });

    /***********************************************************************/
});
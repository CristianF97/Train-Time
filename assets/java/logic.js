  var firebaseConfig = {
    apiKey: "AIzaSyDe88sYiakOug2nWuLO7SbMxcXM_JO-bUw",
    authDomain: "train-time-da10f.firebaseapp.com",
    databaseURL: "https://train-time-da10f.firebaseio.com",
    projectId: "train-time-da10f",
    storageBucket: "train-time-da10f.appspot.com",
    messagingSenderId: "313174103319",
    appId: "1:313174103319:web:85f0e73b6c4a5cb1b41352",
    measurementId: "G-40XXM1ZNYK"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
var db = firebase.database()

$("#submit").on("click", function(event) {
    event.preventDefault(); 

    let trainName = $("#trainName").val().trim();
    let destination = $("#destination").val().trim();
    let trainTime = $("#trainTime").val().trim();
    let frequency = $("#frequency").val().trim();

    let timeString =trainTime;
    let regxForm = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
    let formMatch = !!(timeString.match(regxForm)); 

    if (trainName === "" || destination === "" || trainTime === "" || frequency === "") {
      $("#AlertMess").show().text("Please Complete All Fields");
        return
    }
      
      if (!formMatch) {
        console.log("needs to be a number and in HH:MM Military Format")
        $("#propFormat").text("Please use the correct format.")
        return
  } else {
    $("#propFormat").hide()
  }
  
  if (isNaN(frequency)) {
    console.log("It needs to be a number")
    $("#MinForm").text("Please use the correct format.")
    return
  } else {
    $("#MinForm").hide()
  }
  
  $("#AlertMess").hide()
  $("#propFormat").hide()
  $("#MinForm").hide()
  $("#trainName").val("");
  $("#destination").val("");
  $("#trainTime").val("");
  $("#frequency").val(""); 
  
  db.ref().push({
    TrainName: trainName,
        Destination: destination,
        TrainTime: trainTime,
        Frequency: frequency
    })
});
db.ref().on("child_added", function(snapshot) {
    let trainName = snapshot.child("TrainName").val().trim();
    let destination = snapshot.child("Destination").val().trim();
    let trainTime = snapshot.child("TrainTime").val().trim();
    let frequency = snapshot.child("Frequency").val().trim();

    let trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

    let diffTime = moment().diff(moment(trainTimeConverted), "minutes");

    let tRemainder = diffTime % frequency;

    let minAway = frequency - tRemainder;
    console.log(minAway);

    let nextArrival = moment().add(minAway, "minutes").format("HH:mm");
    console.log(nextArrival);

    


    let newTrain = $(`<tr>
      <td>${trainName}</td>
      <td>${destination}</td>
      <td>${trainTime}</td>
      <td>${frequency}</td>
      <td>${nextArrival}</td>
      <td>${minAway}</td>
      </tr>`);

         $(".newRow").append(newTrain);
});


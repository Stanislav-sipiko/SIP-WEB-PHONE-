navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {audio: true, video: true};
//var video = document.querySelector("audio");

function successCallback(stream) {
alert("good");
  console.log("successCallback ");
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
  alert("bad");
}

navigator.getUserMedia(constraints, successCallback, errorCallback);
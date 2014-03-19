    var turntel;
	var sipstackstarted;
	var websipiko = false;   // Tel turnoffed
	var websipikotelreg = false; // Not registered
	var websipikotelregcur = false; // Not registered current button id
	var sipStack;
	var registerSession;
	var callSession;
	var btpass ;
	var btid;
	chrome.browserAction.setIcon({ path: "phonered38.png" });
	var tabid = false;
	var nstart = 1; // counting strts
	var volume ;
			if("volume" in localStorage){
				volume = parseInt(localStorage.volume) ;
				console.log("============== .....volume "+volume);
			} else{	 
				volume = 1;
				localStorage.volume = 1;			
			}
	var checkmicrophone = false;
	//check state telephone switch
		if("turntel" in localStorage){
			turntel = JSON.parse(localStorage.turntel);
			console.log("switch record present  '%s' ", turntel);
		}
		else{
		localStorage.setItem('turntel', false);
		}
	audio_remote = document.createElement('audio');
    audio_remote.autoplay = "autoplay";
    audio_ringbacktone = document.createElement('audio');
    audio_ringbacktone.src = "ringtone.wav";
    audio_ringbacktone.loop = true;
	audio_ringbacktone.volume=volume;
	
	// Check mrdia permissions-----------
function alertMicrophone(){
alert("Микрофон запрещен - телефон работать не сможет");
}
(function checkMicMedia() {


navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {audio: true, video: false};
//var video = document.querySelector("audio");

function successCallback(stream) {
//alert("good");
  console.log("successCgetUserMedia           checkmicrophone = true ");
  checkmicrophone = true;
}

function errorCallbackm(error){
  console.log("navigator.getUserMedia error: ", error);
   console.log("---------------errorCallbackm      navigator.getUserMedia     checkmicrophone = false ");
   checkmicrophone = false;
   									chrome.tabs.create({
									active: true,
									url: 'options.html'
								}, 	function(tab) {console.log("optons html tab id"+tab.id);});
}

navigator.getUserMedia(constraints, successCallback, errorCallbackm);
 })();
	
	
	
	// Check if we got current button id registration
	
			if("bt_id" && "btpass" in localStorage){
			console.log("websipikotelregcur = true-");
			websipikotelregcur = true;
			btpass = localStorage.btpass;
			btid = parseInt(localStorage.bt_id);
			console.log("websipikotelregcur = true--------------------||||||||||||||||-------------"+btpass+"        "+btid);
	}
			else {
			websipikotelregcur = false;
			console.log("websipikotelregcur = false--------------------||||||||||||||||------------no btpass or btid-");
			}

	// If no internet access - get out of here
	// Check internet connecrions:
		var internet = true;
	    var timer = setInterval(function(){
        var img = new Image();
        img.onload = function(){
				chrome.browserAction.setBadgeText({text: ""});
				localStorage.internet = true; 
				internet = true; 
		}
        img.onerror = function(){
			chrome.browserAction.setBadgeText({text: "out"});
			localStorage.internet = false;
			internet = false;
        }
        img.src = 'http://www.gstatic.com/inputtools/images/tia.png?t='+ Math.random().toString(36).substring(7);
		}, 5000);
	
		if("internet" in localStorage){
			internet = JSON.parse(localStorage.internet);
			console.log("internet connection present  '%s' ", internet);
		}
		else{
			localStorage.setItem('internet', false);
		}
	
	/*
	var internetout;
 function checkInet(){
    if (navigator.onLine){ 
		chrome.browserAction.setBadgeText({text: ""});
		localStorage.internetout = false; 
	}
	else{
		chrome.browserAction.setBadgeText({text: "out"});
        localStorage.internetout = true;
	}

 }
 	setInterval(checkInet, 5000);
	*/

	// Get registration from local storage
	/*
		function getRisterlocalStore(){
		if(webtelreg == true){
		
		}
	}
	function grtRegLoc(){
		if (websipikotelreg){
			btpass = localStorage.getItem('btpass');
			btid = localStorage.getItem('bt_id');
			if( btpass !== "" && btid !== "" && btpass !== 'undefined' && btid != 'undefined'){
			console.log("websipikotelregcur = true--------------------||||||||||||||||-------------"+btpass+"        "+parseInt(btid));
			websipikotelregcur = true;
			return {pass: btpass, login: parseInt(btid)}
			}
			else {
			websipikotelregcur = false;
			console.log("websipikotelregcur = false--------------------||||||||||||||||------------no btpass or btid-");
			return;
			}
		}
	
	}
*/

	
//start check registration	
function gotCheckreg (){
	if (!navigator.onLine){ 
	console.log("main js detect no internet: internetout =false");
	  return;
	  }

		chrome.tabs.create({
			active: false,
			url: 'https://callme.sipiko.net/html5/example/ky.txt'
			//url: 'https://callme.sipiko.net/html5/example/sttacclocalst.html'
		}, 	function(tab) {
				chrome.tabs.executeScript(tab.id, {
					code: 'localStorage.getItem("accounts");'
				},	function(result) {
						chrome.tabs.remove(tab.id)
						console.log(">>>>>>>>>>>>>>>>>>>>>>--any result from callme"+result);
						//if(reg_infobtn)
						//console.log("+++++++++++++++++++++++++++Got reg_infobtn result from callme"+reg_infobtn);
							if (result.length > 0 && result != null && result != "") { 
								websipikotelreg = true;
								console.log(result+" result from callme result.length > 0 && result !== null && result !== ");
								localStorage.setItem('accounts', result);
							}
							else {
									var tabid = true;
									websipikotelreg = false;
									console.log("websipikotelreg = false ----------------------open options.html-");
									chrome.tabs.create({
									active: true,
									url: 'options.html'
								}, 	function(tab) {
								
								console.log("optons html tab id"+tab.id);
								});
							}
							var btid=localStorage.getItem("bt_id");
                            var btpass=localStorage.getItem("btpass");
							if(checkmicrophone == true && btid !== null && btpass !== null && internet == true && turntel == true){
								console.log("Main START -----------------------");
								sipStartstuck(); // Main START -----------------------
								//localStorage.setItem('accounts', result);
								}
							else {
									console.log("========websipikotelregcur = false ----------------------open options.html-"+websipikotelregcur);
									if(tabid !== true)
									chrome.tabs.create({
									active: true,
									url: 'options.html'
								}, 	function(tab) {console.log("optons html tab id"+tab.id);});
							}
					});
			});
}
	gotCheckreg ();
/*
	var iframe = document.createElement("iframe");
iframe.src = "https://callme.sipiko.net/html5/example/ky.txt";
iframe.id = "myframe";
document.body.appendChild(iframe);
///start check registration
setTimeout(function(){
var s = document.createElement('script');
s.src = chrome.extension.getURL("script.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);
},100);	
*/	

	 function playaudio(){
audio_ringbacktone.play();
	}
		 function stopaudio(){
 audio_ringbacktone.pause();
	}
	
	var errorCallback = function(e){
		console.error('Failed to initialize the engine: ' + e.message);
	}
	
	function sipStartstuck(){
	
		var readyCallback = function(e) {

			sipStack = new SIPml.Stack({
					realm: 'asterisk', // mandatory: domain name
					impi: 'cb'+btid, // mandatory: authorization name (IMS Private Identity)
					impu: 'sip:cb'+btid+'@callme.sipiko.net', // mandatory: valid SIP Uri (IMS Public Identity)
					//password: reg.pass, // optional
					password: btpass,
					display_name: '', // optional
					websocket_proxy_url: 'ws://webrtc.sipiko.net:10060', // optional
					outbound_proxy_url: 'udp://callme.sipiko.net:5060', // optional
					enable_rtcweb_breaker: true, // optional
					ice_servers: [{ url: 'stun:stun01.sipphone.com'}],
					enable_click2call: false,
					//enable_early_ims: true,
					events_listener: { events: '*', listener: sipStackEventsListener },
					sip_headers: [ // optional
							{ name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.0.0.0' },
							{ name: 'Organization', value: 'Sipiko' }
					]
			});

			sipStack.start();
		};
		SIPml.init(readyCallback, errorCallback);
	}	
    //  window.onload = sipStartstuck();
	  // Restart sipstack
	     function sipUnRegister() {
			if(interne == true){
				if (sipStack) {
					sipStack.stop(); // shutdown all sessions
					//var reg = grtRegLoc();
					 setTimeout(function () { sipStack.start(); }, 2500);
				}
				else {
				//var reg = grtRegLoc();
				sipStack.start();
				//setTimeout(function () { sipStartstuck(); }, 1500);
				}
			}	
		}
	function sipStackEventsListener(e){
			console.log('-----sipStackEvents===============' + e.type);
			if(e.type == 'started'){
				login();
				websipiko = true;
				sipstackstarted = true;
		}		
		else if(e.type == 'i_new_call'){ // incoming audio/video call
			callSession = e.newSession;
			console.log("---------------i_new_call-----------<i>" + e.description + "</i>");
			playaudio();
			show_newcall();
		}
		else if(e.type == 'm_permission_requested'){ // incoming audio/video call

			// check if we got permissons in iframe or webview
			
		}
		else if(e.type ==  'm_permission_refused'){ // incoming audio/video call
					chrome.tabs.create({url: "options.html"});
		
		}
		else if(e.type ==  'stopping' ){ 
			websipiko = false;
			saySorry();
			chrome.browserAction.setIcon({ path: "phonered38.png" });
		console.log("---------------stopped-----------<i>" + e.description + "</i>");

		}
		else if(e.type ==  'stopped' && localStorage.turntel == "true" && internet == true ){ 

			setTimeout(function () { sipStack.start(); }, 2500);
			chrome.browserAction.setIcon({ path: "phonered38.png" });
		console.log("---------------stopped-----------sipStartstuck in 2500" + e.description + "</i>");

		}
		else if(e.type ==  'stopped' && localStorage.turntel == "false"){
		chrome.browserAction.setIcon({ path: "phonered38.png" });
		websipiko = false;
		}
		else if(e.type == 'failed_to_start' || e.type == 'failed_to_stop'){
				websipiko = false;
				console.log("---------------failed_to_start---------failed_to_stop<i>" + e.description + "</i>");
				nstart += 1;
				if(internet == true){
				setTimeout(function () { sipStack.start(); }, 2500);
								console.log("---------------failed_to_start----------sipStack.start()" + nstart + "start count");
				}
		}
	}


//	 function callSession (e){
//	 console.log('---|||||||||||||||||--function callSession'+e.session+'==============' + e.type);
//	 }
		function hangup_incall() {
			stopaudio();
			if(callSession)
			callSession.hangup({events_listener: { events: '*', listener: sessionEventsListener }});	
		}	
  	function accept_incall() {

		stopaudio();
		if(callSession)
		callSession.accept( {events_listener: { events: '*', listener: sessionEventsListener }});

	}
	/*
	var answer_but = false;
chrome.browserAction.onClicked.addListener(hellovs); 

function hellovs() {
	if (answer_but !== true){
		answer_but = true;
		accept_incall();
	}
	else {
	hangup_incall();
	answer_but = false;
	}
}	
*/
var sessionEventsListener = function(e){	
		console.info('****************** session event = ' + e.type);
		console.log("------------------e.type--: " + e.type+"------e.description:  " + e.description + "<------->>>>>>>>>>>>>>>>>>>");

					
		if (e.type === 'connected'){
			stopaudio();
			websipiko = true;
			chrome.browserAction.setIcon({path: "phone38.png"  });
			console.log("------------------connected-------REGISTER request successfully sent--------//////" );
		}

		else if(e.type === 'transport_error'){
			console.log("------------------registerSession--------Transport error-------------//////" );
			nstart += 1;
				if(localStorage.turntel == "true" && internet == true){
					setTimeout(function () { login(); }, 2500);
					console.log("---------------Transport error----------sipStack.start()============== registerSession " + nstart + "start count");
				}
			//call_status.innerHTML = 'Разговор';
			//document.getElementById("img_status").src="status_red.png";
		}
		else if(e.type === 'm_stream_audio_remote_added'){
			console.log("&&&&&&&&&&&&&&&&&&*****Speaking");
			stopaudio();
			//call_status.innerHTML = 'Разговор';
			//document.getElementById("img_status").src="status_red.png";
		}
		else if(e.type === 'cancelled_request' || e.type == 'transport_error'){
			//hangup_call();
			stopaudio();
			//call_status.innerHTML = 'Сброс';

		}
		else if(e.type === 'terminated' || e.type == 'terminating'){
				//saySorry();
				stopaudio();
				if(localStorage.turntel == 'true')
                setTimeout(function () { sipStack.start(); }, 2500);

                    if (e.session ==  registerSession) {
                       // callSession = null;
                       // registerSession = null;							
                       console.log("------------------registerSession--------<i>" + e.description + "</i>");
						if(e.description == 'Disconnected' && localStorage.turntel == 'true' && internet == true ){ 
		                	setTimeout(function () { sipStack.start(); }, 2500);
					   		chrome.browserAction.setIcon({ path: "phonered38.png" });
							websipiko = false;	
								console.log("------------------registerSession--------Disconnected" );
						}	
						// check for remome from code - it was in line 301
						if(e.description == 'Transport error'){						
								console.log("------------------registerSession--------Transport error-------------//////" );
									nstart += 1;
							if(internet == true){
								setTimeout(function () { sipStack.start(); }, 2500);
								console.log("---------------Transport error----------sipStack.start()============== registerSession " + nstart + "start count");
							}
						}
					   
                    }
                    else if (e.session == callSession) {
					//saySorry();
					callSession = null;
                      console.log("---------------callSession-----------<i>" + e.description + "</i>");
                    }
                   // break;



		}
	}

		function login(){
		//try {
			// LogIn (REGISTER) as soon as the stack finish starting

			registerSession = sipStack.newSession('register', {
				expires: 200,
				events_listener: { events: '*', listener: sessionEventsListener },
				sip_caps: [
							{ name: '+g.oma.sip-im', value: null },
							{ name: '+audio', value: null },
							{ name: 'language', value: '\"en,fr\"' }
					]
			});
			registerSession.register();
		//}
	}

	
	

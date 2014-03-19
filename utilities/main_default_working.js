
	var sipStack;
	var registerSession;
	var callSession;
	    audio_remote = document.createElement('audio');
    audio_remote.autoplay = "autoplay";
    audio_ringbacktone = document.createElement('audio');
    audio_ringbacktone.src = "ringtone.wav";
    audio_ringbacktone.loop = true;
/*
	var iframe = document.createElement("iframe");
iframe.src = "https://callme.sipiko.net/html5/example/ky.txt";
iframe.id = "myframe";
document.body.appendChild(iframe);
*/
setTimeout(function(){
var s = document.createElement('script');
s.src = chrome.extension.getURL("script.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);
},200);	
	

	 function playaudio(){
audio_ringbacktone.play();

	}
		 function stopaudio(){
 audio_ringbacktone.pause();
	}
	
	var errorCallback = function(e){
		console.error('Failed to initialize the engine: ' + e.message);
	}
	
	var readyCallback = function(e) {
		sipStack = new SIPml.Stack({
				realm: 'asterisk', // mandatory: domain name
				impi: 'cb20', // mandatory: authorization name (IMS Private Identity)
				impu: 'sip:cb20@callme.sipiko.net', // mandatory: valid SIP Uri (IMS Public Identity)
				password: 'raw2xk59og', // optional
				display_name: '', // optional
				websocket_proxy_url: 'ws://webrtc.sipiko.net:10060', // optional
				outbound_proxy_url: 'udp://callme.sipiko.net:5060', // optional
				enable_rtcweb_breaker: true, // optional
				ice_servers: [{ url: 'stun:stun.l.google.com:19302'}],
				enable_click2call: false,
				//enable_early_ims: true,
				events_listener: { events: '*', listener: sipStackEventsListener },
				sip_headers: [ // optional
						{ name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.0.0.0' },
						{ name: 'Organization', value: 'Sipiko' }
				]
			}
		);
		sipStack.start();
	};
	

	function sipStackEventsListener(e){
			console.log('-----sipStackEvents===============' + e.type);
			if(e.type == 'started'){
				login();
		}		
		else if(e.type == 'i_new_call'){ // incoming audio/video call
			callSession = e.newSession;
			playaudio();
			
		}
		else if(e.type == 'm_permission_requested'){ // incoming audio/video call

			// check if we got permissons in iframe or webview
			
		}
		else if(e.type ==  'm_permission_refused'){ // incoming audio/video call
					chrome.tabs.create({url: "checkmic.html"})
		
		}
	}


	SIPml.init(readyCallback, errorCallback);
	
		function hangup_incall() {

		stopaudio();
		callSession.hangup({events_listener: { events: '*', listener: sessionEventsListener }});	
	}	
  	function accept_incall() {

		stopaudio();
		callSession.accept( {events_listener: { events: '*', listener: sessionEventsListener }});

	}
	/*
	var answer_but = false;
chrome.browserAction.onClicked.addListener(hellovs); 

function hellovs() {
	if (answer_but != true){
		answer_but = true;
		accept_incall();
	}
	else {
	hangup_incall();
	answer_but = false;
	}
}	
*/
function sessionEventsListener (e){	
		console.info('****************** session event = ' + e.type);
		if (e.type === 'connected'){
			stopaudio();
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
			//document.getElementById("img_status").src="status_red.png";
		}
		else if(e.type === 'terminated' || e.type == 'terminating'){
				//hangup_call();
				stopaudio();
				//call_status.innerHTML = 'Включен';
		       // document.getElementById("img_status").src="status_green.png";
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

	
	
	

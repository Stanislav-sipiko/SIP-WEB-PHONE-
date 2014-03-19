var total_persents = 0;
var total_points = 0;
var reload_notif = 0;
var update_notif = 0;
var myNotificationID;
var myNotificationIDA;
// Notifications ?accept-hangup
// Notifier  show_newcall
function show_newcall() {
    startingcalllAlarm();
    currentCall();
    chrome.notifications.create('id', {
        priority: 2,
        type: 'progress',
        iconUrl: 'phone48.png',
        title: 'Входящий звонок',
        message: 'Accept - Ignore ' + prosent_persec,
        contextMessage: 'Время звонка:  Длительность:',
        // The title.,
        progress: 30,
        isClickable: false,
        buttons: [
            {
                title: 'ПРИНЯТЬ',
                iconUrl: 'acceptcall.png'
            },
            {
                title: 'ОТКЛОНИТЬ',
                iconUrl: 'rejectcall.png'
            }
        ]
    }, function (id) {
        myNotificationID = id;
        console.log('----------myNotificationID----------  ' + id);
    });
    setTimeout(function () {
        if (typeof myNotificationID != 'undefined')
        chrome.notifications.clear(myNotificationID, function () {
        });
        cancecalllAlarm();
    }, 150000);
}
//  notification.show();
/* Respond to the user's clicking one of the Notification buttons */

chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
    if (typeof myNotificationID != 'undefined' && notifId === myNotificationID) {
        if (btnIdx === 0) {
            counProgress();
            //count progress start	
            sayAccept();
            console.log('Acepted incoming call from notification');
        } else if (btnIdx === 1) {
            stopProgress();
            saySorry();
            console.log('Decline incoming call from notification');
        }
    }
    if (typeof myNotificationIDA != 'undefined' && notifId === myNotificationIDA) {
        if (btnIdx === 0) {
            stopProgress();
            // stop looping notification updates				
            saySorry();
            console.log('first button');
        } else if (btnIdx === 1) {
            stopProgress();
            // stop looping notification updates				
            saySorry();
            console.log('Second button');
        }
    }
});
// after accept call notif
function clearNotificat(notifID) {
    if (typeof notifID != 'undefined') {
        chrome.notifications.clear(notifID, function () {
            console.log('clear(myNotificationID');
        });
    }
}
function afterAccept() {
    if (typeof myNotificationIDA != 'undefined')
    clearNotificat(myNotificationIDA);
    chrome.notifications.create('ida', {
        priority: 1,
        type: 'progress',
        iconUrl: 'phone48.png',
        title: 'Входящий звонок',
        message: 'СОЕДИНЕН:' + total_points + ' сек',
        contextMessage: 'Длительность: ' + total_points + ' сек',
        // The title.,
        progress: total_persents,
        isClickable: false,
        buttons: [
            {
                title: 'ОТКЛОНИТЬ',
                iconUrl: 'rejectcall.png'
            }
        ]
    }, function (ida) {
        myNotificationIDA = ida;
        console.log('---------myNotificationIDA-----------  ' + ida);
    });
    // count progress stop
}
//update notification

function updateNotif() {
    if (typeof myNotificationIDA != 'undefined')
    chrome.notifications.update(myNotificationIDA, {
        priority: 1,
        type: 'progress',
        iconUrl: 'phone48.png',
        title: 'Входящий звонок',
        message: 'СОЕДИНЕН:' + total_points + ' сек',
        contextMessage: 'Длительность: ' + total_points + ' сек',
        // The title.,
        progress: total_persents,
        isClickable: false,
        buttons: [
            {
                title: 'ОТКЛОНИТЬ',
                iconUrl: 'rejectcall.png'
            }
        ]
    }, function (wasUpdated) {
        if (wasUpdated != true)
        stopProgress();
        console.log(wasUpdated);
        console.log(myNotificationIDA);
    });
}
// Counting Call progress

var prosent_persec = 1;
var points_per_second = 1;
var reload_notiflim = 24;
var update_notiflim = 5;
var countupdates = 0;
var ticker;
//var nn = 1; // total updates
function update_display() {
    total_points += points_per_second;
    total_persents += prosent_persec;
    reload_notif += points_per_second;
    update_notif += points_per_second;
    //console.log(total_points+"reload_notif"+reload_notif+"update_notif"+update_notif);
    if (reload_notif >= reload_notiflim) {
        reload_notif = 0;
        afterAccept();
        //	setTimeout(function() {afterAccept();}, 10);
    }
    if (update_notif >= update_notiflim) {
        setTimeout(function () {
            updateNotif();
        }, 500);
        update_notif = 0;
    }
    if (total_points >= 600) {
        clearInterval(ticker);
        return ;
    }
    //return  total_points;

}
function counProgress() {
    ticker = setInterval(update_display, 1000);
}
function stopProgress() {
    clearInterval(ticker);
    total_points = 0;
    total_persents = 0;
    reload_notif = 0;
    update_notif = 0;
}
function saySorry() {
    chrome.browserAction.setBadgeText({
        text: ''
    });
    cancecalllAlarm();
    chrome.browserAction.setIcon({
        path: 'phone38.png'
    });
    clearNotificat(myNotificationID);
    clearNotificat(myNotificationIDA);
    //hangup_incall();
    //setTimeout(function() {sipUnRegister();}, 300);
    stopaudio();
    if (callSession)
    hangup_incall();
}
function sayAccept() {
    clearNotificat(myNotificationID);
    clearNotificat(myNotificationIDA);
    setTimeout(function () {
        afterAccept();
    }, 100);
    chrome.browserAction.setBadgeText({
        text: ''
    });
    cancecalllAlarm();
    chrome.browserAction.setIcon({
        path: 'notr38.png'
    });
    accept_incall();
    //-----------------------for test reason only
}
// Get current time of call

function addZero(i)
{
    if (i < 10)
    {
        i = '0' + i;
    }
    return i;
}
function currentCall()
{
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    calltime = h + ':' + m + ':' + s;
}
/* Add this to also handle the user's clicking 
 * the small 'x' on the top right corner 

chrome.notifications.onClosed.addListener(function() {
 chrome.browserAction.setIcon({
            path: "phone38.png"
        });
 alert("Остались без управдения телефоном"+
		"вариант - перезапустить тел. кликнув на иконку");
});

/* Handle the user's rejection  */
// Call icon alarming

var animstatus = false;
function startfire() {
    if (!animstatus)
    {
        chrome.browserAction.setIcon({
            path: 'phonered38.png'
        });
        // console.log("phone38.png  "+animstatus);
        animstatus = true;
    } 
    else
    {
        chrome.browserAction.setIcon({
            path: 'phone38.png'
        });
        animstatus = false;
    }
}
var animInterval;
function cancecalllAlarm() {
    clearInterval(animInterval);
    chrome.browserAction.setIcon({
        path: 'phone38.png'
    });
}
function startingcalllAlarm() {
    animInterval = setInterval(startfire, 300);
}
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        if (key == 'myKey') {
            console.log('<<<<<<<key ======="%s"  ', key);
        }
        if (key == 'chrturntel') {
            console.log('<<<<<<chrturntel ======="%s"  = "%s"  ', key, storageChange.newValue);
            if (storageChange.newValue == true) {
                if (sipStack) sipStack.start();
                sipStartstuck();
                console.log('<<<<<<chrturntel =======START ===========sipStartstuck  ');
            }
            if (storageChange.newValue == false) {
                //if(sipStack)	
                sipStack.stop();
                console.log('<<<<<<chrturntel =======STOPPPPPPPPPPPPPPPPPPPPPPPPPPPPP ===========sipStartstuck  ');
            }
        }
        //alert(key+"  -Key value"+storageChange.newValue);

        console.log('|||||||||||||||||||||||||||||||||||>>>>>>>>>>>>Storage key "%s" in namespace "%s" changed. ' +
        'Old value was "%s", new value is "%s".', key, namespace, storageChange.oldValue, storageChange.newValue);
    }
});
$(document) .ready(function () {
    $(window) .bind('storage', function (e) {
        console.log('===============================<<<<<<<<<>>>>>>change "%s"    "%s"', e.originalEvent.key, e.originalEvent.newValue);
        if (e.originalEvent.key == 'bt_id') {
            if ('bt_id' && 'btpass' in localStorage) {
                chrome.runtime.reload();
                /*  
					console.log("websipikotelregcur = true-");
					websipikotelregcur = true;
					btpass = localStorage.btpass;
					btid = parseInt(localStorage.bt_id);
					console.log("websipikotelregcur = true--------------------||||||||||||||||-------------"+btpass+"        "+btid);
				   if (sipstackstarted == true){
				   sipStack.setConfiguration({
					realm: 'asterisk', // mandatory: domain name
					impi: 'cb'+btid, // mandatory: authorization name (IMS Private Identity)
					impu: 'sip:cb'+btid+'@callme.sipiko.net', // mandatory: valid SIP Uri (IMS Public Identity)
					//password: reg.pass, // optional
					password: btpass,
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
									login();
									   }
										sipStartstuck();
											console.log('!!!!!!!!!!!++++++++++++>>>>>>>>>>>>>    relogin');
											*/
            } 
            else {
                websipikotelregcur = false;
                console.log('websipikotelregcur = false--------------------||||||||||||||||------------no btpass or btid-');
            }
        }
        if (e.originalEvent.key == 'internet' && e.originalEvent.newValue == 'true') {
            console.log('Internet comming  internet = "%s" ', e.originalEvent.newValue);
            if (sipStack) {
                sipStack.start();
            }
            sipStartstuck();
        }
        if (e.originalEvent.key == 'internet' && e.originalEvent.newValue == 'false') {
            console.log('Internet out = "%s" ', e.originalEvent.newValue);
            sipStack.stop();
        }
        if (e.originalEvent.key == 'volume') {
            audio_ringbacktone.volume = parseInt(e.originalEvent.newValue);
            console.log('-----******------  set new ring volue = "%s" ', e.originalEvent.newValue);
        }
    });
});


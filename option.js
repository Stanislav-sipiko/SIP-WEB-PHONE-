$(document).ready(function(){
var bkg = chrome.extension.getBackgroundPage();

console.log("Current status websipiko  "+bkg.websipiko+" websipikotelreg  "+bkg.websipikotelreg);
   // var websipiko = false;   // Tel turnoffed
	//var websipikotelreg = false; // Not registered
$(function() {
    // setup ul.tabs to work as tabs for each div directly under div.panes
    $("ul.tabs").tabs("div.panes > div");
});
function reloadPage()
  {
  location.reload();
  }
// Check user media
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {audio: true, video: true};
//var video = document.querySelector("audio");

function successCallback(stream) {
document.getElementById('micro').innerHTML = "Разрешен";
if(bkg.checkmicrophone){
bkg.checkmicrophone = true;
  console.log("successCallback ");
  }
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
bkg = chrome.extension.getBackgroundPage();
bkg.alertMicrophone();    
bkg.checkmicrophone = false;
document.getElementById('tel_statusis').innerHTML= '<span style = "font-size: 10px;">Включить микрофон</span>';
document.getElementById('statmic_td').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
//document.getElementById('stat_teltd').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
}

navigator.getUserMedia(constraints, successCallback, errorCallback);

  //Notification about registration

//Prevent click on bis tariff

	 $("#business_tar")
   .mouseup(function() {
    $("#alert_busines" ).html( "&nbsp" );
  })
  .mousedown(function() {
    $("#alert_busines").html( "<span style='color:#f00;'>Только для 'Бизнес'</span>" );
  });
  $( document ).on( "click", "a.unclick", function() {
     //alert("got click");
	 getThereg();
     event.preventDefault();
});
$( document ).on( "click", "#bt_closetab", function() {
   bkg = chrome.extension.getBackgroundPage();
	bkg.tabid = false;
	window.close();
   event.preventDefault();
});
$( document ).on( "click", "#bt_refresh", function() {
  //alert("got click");
	//location.reload();
	chrome.runtime.reload();
  event.preventDefault();
});
$( document ).on( "click", "#bt_refresh_id", function() {
  //getThereg();
	bkg = chrome.extension.getBackgroundPage();
	bkg.gotCheckreg ();
	event.preventDefault();
});


// End clicks window.close()
//Click to register
function getThereg(){
	     chrome.windows.create({
	incognito: false,
    type: 'normal',
    url: "https://callme.sipiko.net/client/index.php?go=/client/buttons.php",
	left: 10,
	top: 5,
	width: 600,
	height: 500,
	focused: true,
	},  function (windowregid) { 
				var windowreg = windowregid.id;
				chrome.tabs.query({'windowId': windowreg}, function(tabs) {
					chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
						if(changeInfo.status == "complete") {
							chrome.tabs.executeScript(tabs[0].id, {
									code: "localStorage.getItem('accounts')"
								},  function(result) {
										 
										if (result.length > 0 && result != null && result != "") { 
											console.log("any result from callme >>>>>>>>>>>>>>>>>>>>>>>>>> "+result);
											localStorage.setItem('accounts', result);
											console.log("any result from callme"+result);
											console.log(" ------------got json accounts");
											chrome.windows.remove(windowreg);
											bkg = chrome.extension.getBackgroundPage();
											reloadPage();
											sTart();
	
										}
										else {
												console.log(" ------------sent to options OOOOPS to get json accounts");
										}
									});
						}	
					});
				});
		});
}
// Tnd of click to register
nn= 1;
function sTart() {
console.log("sTart = "+nn++);
callregsips=localStorage.getItem("accounts");


if (callregsips == null || callregsips == "undefined" || callregsips == "" ) {
   document.getElementById('reg_status').innerHTML= '<a class="unclick" href="https://callme.sipiko.net/client/index.php">Зарегистрировать</a>';
     // document.getElementById('tel_statusis').innerHTML= 'Ожидает регистрации';
	//  document.getElementById('stat_teltd').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
	  
   console.log("Not registered");
}
else {
console.log("Registered "+callregsips);
var btid=localStorage.getItem("bt_id");
var btname=localStorage.getItem("bt_name");
var btpass=localStorage.getItem("btpass");
console.log("bt_id = "+btid+" btname "+btname);
/*
bkg = chrome.extension.getBackgroundPage();
if (typeof bkg.websipiko !== "undefined" && bkg.websipiko !==true) {
console.log(bkg.websipiko);
document.getElementById('turntel').innerHTML = "Выключен";

}
else{
bkg = chrome.extension.getBackgroundPage();

if(bkg.checkmicrophone == true){
document.getElementById('radio1_A').checked = true;
document.getElementById('radio1_B').checked = false;

document.getElementById('turntel').innerHTML = "Включен";

}
}
 if("turntel" in localStorage){
*/
var items = JSON.parse(atob(callregsips));
document.getElementById('bt_num').innerHTML = items.length;
document.getElementById('reg_status').innerHTML= 'Зарегистрирован';

if(!btid) {
document.getElementById('bt_id').innerHTML =items[0].id;
localStorage.setItem('bt_id', items[0].id);
}
else {
document.getElementById('bt_id').innerHTML =btid;

}
if(!btname) {
document.getElementById('bt_name').innerHTML =items[0].name;
localStorage.setItem('bt_name', items[0].name);
}
else
{
document.getElementById('bt_name').innerHTML =btname;
}
if(!btpass) {

localStorage.setItem('btpass', items[0].password);
}
for (var i = 0;i<items.length;i++)
{
/*
if(i == 0){

mssgs = ' <option value="'+items[i].id+' selected>'+items[i].id+'</option><br />';
document.getElementById('sip_acc').innerHTML += mssgs;
}
*/
if(items[i].password !== ""){
mssgs = ' <option value="'+items[i].id+'">'+items[i].name+' (ID '+items[i].id+')</option><br />';
document.getElementById('sip_acc').innerHTML += mssgs;
}
  console.log(" id:  "+items[i].id + "  pass: "+items[i].password+ "  name: "+items[i].name+"<br />");


}
//Test button
btid=localStorage.getItem("bt_id");
if(btid) {
document.getElementById('call_knopa').innerHTML ="<a href='https://callme.sipiko.net/callme.php?id="+btid+"&call_id=210&tunnel=yes' class='sipiko_callme'><img src='button4.png' /></a>";
$( document ).on( "click", "#call_knopa", function() {
	     chrome.windows.create({
	incognito: false,
    type: 'popup',
    url: "https://callme.sipiko.net/callme.php?id="+btid+"&call_id=210&tunnel=yes",
	left: 10,
	top: 5,
	width: 300,
	height: 275,
	focused: true,
	},  function (windowregid) {
console.log("opened test window");
});
	event.preventDefault();
});
}
}



// Turn on - turn off

var xturnon = document.getElementById('myonoffswitch');

var telstate=localStorage.getItem("turntel");
	 console.log(telstate+' = telstate  ------------localStorage.getItem -----------,,,,,,,,,,,');
 if("turntel" in localStorage){
xturnon.checked = JSON.parse(localStorage.turntel);
}

//if (typeof xturnon !== "undefined" && xturnon !== null){
xturnon.onchange=function(e){
	xturnon.innerHTML = this.checked;
	 console.log(this.checked);	
  console.log("checked = "+this.checked);
	localStorage.setItem('turntel', this.checked);

	valcheked = this.checked;
	chrome.storage.sync.set({"chrturntel": valcheked}, function () {
    console.log('Saved chrome.storage key = "%s"    "%s" valcheked  ', key, valcheked);
    });

	if(this.checked == true){
	document.getElementById('turntel').innerHTML = "Включен";
		document.getElementById('turntel_check').innerHTML= '';
	/*
		bkg = chrome.extension.getBackgroundPage();
		if(bkg.sipStack){
		bkg.sipStack.start();
		}
		else{
		sipStartstuck();
		}
		*/
		console.log("checked = bkg.sipStack.start");
	}
		if(this.checked == false){
		document.getElementById('turntel').innerHTML = "Выключен";
				document.getElementById('turntel_check').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
		/*
		bkg = chrome.extension.getBackgroundPage();
		bkg.sipStack.stop();
		console.log("checked = bkg.sipStack.stop");
		*/
	}

}

/*
var xturnof = document.getElementById('radio1_B');
if (typeof xturnof !== "undefined" && xturnof !== null){
xturnof.onchange=function(e){
	document.getElementById('turntel').innerHTML = this.value;
	 console.log(this.checked);	
  console.log("Value = "+this.value);
	localStorage.setItem('turntelb', this.value);

   if(bkg.sipStack)
  bkg.sipStack.stop();
}
}
*/
if (xturnon.checked == true){
document.getElementById('turntel').innerHTML = "Включен";
document.getElementById('turntel_check').innerHTML= '';
console.log("TURNON");
}
else{
document.getElementById('turntel').innerHTML = "Выключен";
document.getElementById('turntel_check').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
console.log("TURNOFF");
}
// Tke chance on buttid
select = document.getElementById("sip_acc");
select.onchange = function(){
  currentbutid = this.value;
document.getElementById('bt_id').innerHTML = currentbutid;

for (var i = 0;i<items.length;i++)
{
  if(items[i].id == currentbutid)
  {
	localStorage.setItem('bt_id', items[i].id);
	localStorage.setItem('bt_name', items[i].name);
	localStorage.setItem('btpass', items[i].password);
	bkg = chrome.extension.getBackgroundPage();
	bkg.sipUnRegister();
    return document.getElementById('bt_name').innerHTML =items[i].name;
  }
}
}
//Volume
var cur_volume=localStorage.getItem("volume");
if (typeof cur_volume !== "undefined" && cur_volume !== ""){
	document.getElementById('carr_range').innerHTML = cur_volume;
	document.getElementById('vol_range').value =cur_volume;
}
document.getElementById('vol_range').onchange=function(e){
	document.getElementById('carr_range').innerHTML = this.value;
	localStorage.setItem('volume', this.value);
  console.log("Value = "+this.value);
}

var voloff = document.getElementById('bt_voloff');
voloff.onchange=function(e){

if(voloff.checked == true){
	document.getElementById('carr_range').innerHTML = 0;
	document.getElementById('vol_range').value = 0;
	localStorage.setItem('volume', 0);
	  console.log("<<<<<<<<<<<<<<<<Value = "+this.checked);
}
}

// turn tel


function clickCounter()
{
if(typeof(Storage)!=="undefined")
  {
  if (sessionStorage.clickcount)
    {
    sessionStorage.clickcount=Number(sessionStorage.clickcount)+1;
    }
  else
    {
    sessionStorage.clickcount=1;
    }
	if(sessionStorage.clickcount>2)
	alert("Хватит экспериментировать!");
  //document.getElementById("result").innerHTML="You have clicked the button " + sessionStorage.clickcount + " time(s) in this session.";
  }
else
  {
  document.getElementById("result").innerHTML="Sorry, your browser does not support web storage...";
  }
}
}

 sTart();
 // Internet status
 var internetoutp;
 function checkInet(){
    if (navigator.onLine){ 
		 document.getElementById('inet_status').innerHTML= "Есть";
		internetoutp = false; 
	}
	else{
		 document.getElementById('inet_status').innerHTML="Пропал"
		 document.getElementById('inet_statusi').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
        internetoutp = true;
	}

 }
 	setInterval(checkInet, 5000);

               $(window).bind('storage', function(e) {
               console.log('change "%s"    "%s"', e.originalEvent.key, JSON.parse(e.originalEvent.newValue));
            });
			
			// current selected id
			if("bt_id" in localStorage){
				gg = document.getElementById("sip_acc").value =localStorage.bt_id;
				gg.selected=true;
				}
			
	//Storage ivents
chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (key in changes) {

          var storageChange = changes[key];
		  		if(key == 'chrturntel'){
		localStorage.turntel= storageChange.newValue;
		document.getElementById('myonoffswitch').checked = JSON.parse(storageChange.newValue);
		if (storageChange.newValue == true){
document.getElementById('turntel').innerHTML = "Включен";
document.getElementById('turntel_check').innerHTML= '';
console.log("TURNON");
}
else{
document.getElementById('turntel').innerHTML = "Выключен";
document.getElementById('turntel_check').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
console.log("TURNOFF");
}
         
		console.log('<<<<<<<key ======="%s"======= newValue  "%s"     JSON.parse    "%s"', key, storageChange.newValue, JSON.parse(storageChange.newValue));
		}
         // alert(key+"  -Key value"+storageChange.newValue);
          console.log('|||||||||||||||||||||||||||||||||||>>>>>>>>>>>>Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
        }
      });	
			
			//////////
//			function periodicalCheck(){

    var timer = setInterval(function(){
        var img = new Image();
        img.onload = function(){
			chrome.browserAction.setBadgeText({text: ""});
		      localStorage.internet = true; 
			  }
        img.onerror = function(){
        chrome.browserAction.setBadgeText({text: "out"});
        localStorage.internet = false;
        }
        img.src = 'http://www.gstatic.com/inputtools/images/tia.png?t='+ Math.random().toString(36).substring(7);
    }, 5000);

//}


			/////////
			
  // Taggle info
	
	
	$( ".cont_free" ).hide();
	$( ".cont_pay" ).hide();
	$( ".serv_free" ).click(function() {
  $( ".cont_free" ).slideToggle( "slow" );
});
$( ".serv_pay" ).click(function() {
  $( ".cont_pay" ).slideToggle( "slow" );
});
 });

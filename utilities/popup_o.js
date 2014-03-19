$(document).ready(function(){
var bkg = chrome.extension.getBackgroundPage();
  if (!navigator.onLine){ 
document.getElementById('content').innerHTML = "Выключен интернет";
  return;
}

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
var bkg = chrome.extension.getBackgroundPage();
bkg.checkmicrophone = true;
  console.log("successCallback ");
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
bkg = chrome.extension.getBackgroundPage();
//bkg.alertMicrophone();    
 bkg.checkmicrophone = false;
document.getElementById('tel_statusis').innerHTML= 'Включить микрофон';

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
// End clicks
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
									code: "reg_infobtn = localStorage.getItem('accounts');"
								},  function(result) {
										 
										if (result!="undefined" && result!= null) { 
											localStorage.setItem('accounts', result);
											//console.log("any result from callme"+result);
											console.log(" ------------got json accounts");
											chrome.windows.remove(windowreg);
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
var callregsips=localStorage.getItem("accounts");


if (callregsips === null || callregsips	===	"undefined") {
   document.getElementById('reg_status').innerHTML= '<a class="unclick" href="https://callme.sipiko.net/client/index.php">Зарегистрировать</a>';
    document.getElementById('tel_statusis').innerHTML= 'Ожидает регистрации';
	document.getElementById('stat_teltd').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
	document.getElementById('turntel_check').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
	
   console.log("Not registered");
}
else {
console.log("Registered");
var btid=localStorage.getItem("bt_id");
var btname=localStorage.getItem("btname");
console.log("btid = "+bt_id+" btname "+btname);
var bkg = chrome.extension.getBackgroundPage();
if (bkg.websipiko != "undefined" && bkg.websipiko !=true) {
console.log(bkg.websipiko);
document.getElementById('turntel').innerHTML = "Выключен";
document.getElementById('stat_teltd').innerHTML= '<img src="check_icon_red.png" style="vertical-align: middle" />';
}
else{
var bkg = chrome.extension.getBackgroundPage();
console.log(bkg.websipiko);
if(bkg.checkmicrophone = true){
document.getElementById('radio1_A').checked = true;
document.getElementById('radio1_B').checked = false;;

document.getElementById('turntel').innerHTML = "Включен";
}
}

var items = JSON.parse(atob(callregsips));
document.getElementById('bt_num').innerHTML = items.length;
document.getElementById('reg_status').innerHTML= 'Зарегистрирован';

if(!btid) {
document.getElementById('bt_id').innerHTML =items[0].id;
}
else {
document.getElementById('bt_id').innerHTML =btid;
}
if(!btname) {
document.getElementById('bt_name').innerHTML =items[0].name;
}
else
{
document.getElementById('bt_name').innerHTML =btname;
}

for (var i = 0;i<items.length;i++)
{
/*
if(i == 0){

mssgs = ' <option value="'+items[i].id+' selected>'+items[i].id+'</option><br />';
document.getElementById('sip_acc').innerHTML += mssgs;
}
*/
mssgs = ' <option value="'+items[i].id+'">'+items[i].id+'</option><br />';
document.getElementById('sip_acc').innerHTML += mssgs;
//  console.log(" id "+items[i].id + "pass"+items[i].password+ "pass"+items[i].name+"<br />");
}

}
// Turn on - turn off

var xturnon = document.getElementById('radio1_A');
if (typeof xturnon !== "undefined" && xturnon !== null){
xturnon.onchange=function(e){
	document.getElementById('turntel').innerHTML = this.value;
	 console.log(this.checked);	
  console.log("Value = "+this.value);
  clickCounter();

if(bkg.sipStack !== "undefined"){
console.log(bkg.sipStack+"  First if ========");
	bkg.grtRegLoc();
  bkg.sipUnRegister();
	}
	else{
		  console.log(bkg.sipStack+"  First else ========");
		  bkg.grtRegLoc();
	  bkg.sipStack.start();
	}
}
};
var xturnof = document.getElementById('radio1_B');
if (typeof xturnof !== "undefined" && xturnof !== null){
xturnof.onchange=function(e){
	document.getElementById('turntel').innerHTML = this.value;
	 console.log(this.checked);	
  console.log("Value = "+this.value);
  //clickCounter();
    bkg = chrome.extension.getBackgroundPage();
   if(bkg.sipStack)
	bkg.sipStack.stop();
	console.log("radio1_A = ----------turned off");
}
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
	localStorage.setItem('btname', items[i].name);
	localStorage.setItem('btpass', items[i].password);

    return document.getElementById('bt_name').innerHTML =items[i].name;
  }
}


}
//Volume
	var volume=localStorage.getItem("volume");
	if(volume != 'undefined' && volume != null){
	document.getElementById('vol_range').value = parseInt(volume);
	document.getElementById('carr_range').innerHTML = parseInt(volume);
		//volume = parseInt(volume)/10 ;
		console.log("volume "+parseInt(volume));
	} else{	
	document.getElementById('vol_range').value = 10;
	console.log("default volume 10");
	} 
document.getElementById('vol_range').onchange=function(e){
	document.getElementById('carr_range').innerHTML = this.value;
	localStorage.setItem('volume', this.value);
  console.log("Value = "+this.value);
}

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
 });
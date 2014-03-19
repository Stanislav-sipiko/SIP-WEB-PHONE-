chrome.tabs.create({
    active: false,
    url: 'https://callme.sipiko.net/html5/example/ky.txt'
}, function(tab) {
    chrome.tabs.executeScript(tab.id, {
        code: 'reg_infobtn = localStorage.getItem("accounts");'
    },function(result) {
			 chrome.tabs.remove(tab.id);
						console.log("any result from callme"+result);
				if (result!="undefined" && result!= null) { 
					localStorage.setItem('accounts', result);
				}
    });
});
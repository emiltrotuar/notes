chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	chrome.notifications.create("", request, function(Id){
		setTimeout(chrome.notifications.clear, 3000, Id, function(cleared){});
	});
});
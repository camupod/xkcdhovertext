
function handleRequest(request, sender, sendResponse) {
	if (request === "options") {
		var response = Options.getAll();
		sendResponse(response);
	}
}
chrome.extension.onMessage.addListener(handleRequest);
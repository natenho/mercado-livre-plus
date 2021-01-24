
chrome.runtime.onMessage.addListener(
    function (request, _sender, sendResponse) {
        if (request.contentScriptQuery == "fetchShipping") {
            var url = request.url;            
            fetch(url)
                .then(async response => {
                    const html = await response.text();                    
                    sendResponse(html);
                })
                .catch(error => console.log('Error fetchShipping', error))
            return true;
        }
    });
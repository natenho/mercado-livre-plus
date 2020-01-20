
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.contentScriptQuery == "fetchShipping") {
            var url = request.url;
            fetch(url)
                .then(async response => {
                    const html = await response.text();
                    console.log(url + 'background ' + html);
                    sendResponse(html);
                })
                .catch(error => console.log('Error fetchShipping', error))
            return true;
        }
    });
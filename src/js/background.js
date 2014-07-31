;(function() {


  /**
   * Stores messages for each tab keyed by tabId
   */
  var tabMessages = {};


  /**
   * Listen to all responses for images
   * 
   * If the status code is 404 and the host have a fallback url configured notify the content script
   */
  chrome.webRequest.onCompleted.addListener(function(e) {

    // Ignore responses if the status code was not a 404 or 500 
    // Some CMSs return a 500 for missing images that are dynamically generated
    if (!e.statusCode || (e.statusCode !== 404 && e.statusCode !== 500)) {
      return;
    }

    var currentUrl = _parseUrl(e.url);

    // Get the configured host fallbacks
    chrome.storage.local.get(function(settings) {

      if (settings[currentUrl.host]) {

        var fallbackHost = settings[currentUrl.host].fallback,
            fallbackProtocol = currentUrl.protocol + '//',
            targetImage = currentUrl.pathname + currentUrl.search,
            fallbackUrl = fallbackProtocol + fallbackHost + targetImage;

        if (!tabMessages[e.tabId]) {
          tabMessages[e.tabId] = [];
        }

        // Add fallback to the message queue for this tab
        // We can't send directly to the content script as it probably isn't loaded yet.
        // Instead the content script must request image replacements once it is loaded
        tabMessages[e.tabId].push({
          target: targetImage,
          fallback: fallbackUrl
        });
      }

    });
  }, {
    urls: ['<all_urls>'],
    types: ['image']
  }, ['responseHeaders']);


  /**
   * Listen for messages from the content script
   */
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    // Return images fallbacks for this tab
    if (request.action === 'getImageFallbacks') {
      sendResponse(tabMessages[sender.tab.id]);
      delete tabMessages[sender.tab.id];
    }

  });


  /**
   * Parse a URL
   * https://gist.github.com/jlong/2428561
   */
  var _parseUrl = function(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
  };

})();

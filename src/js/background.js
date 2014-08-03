;(function() {

  var Settings = require('./libs/settings'),
      utils = require('./libs/utils');


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

    var currentUrl = utils.parseUrl(e.url);

    // Get the configured host fallbacks
    Settings.get(currentUrl.host, function(settings) {
      if (settings) {
        var fallbackHost = settings.fallback,
            fallbackProtocol = currentUrl.protocol + '//',
            targetImage = currentUrl.pathname + currentUrl.search,
            fallbackUrl = fallbackProtocol + fallbackHost + targetImage;

        if (!tabMessages[e.tabId]) {
          tabMessages[e.tabId] = [];
        }

        var message = {
          target: targetImage,
          fallback: fallbackUrl
        };

        // Send a message to the content script for this tab
        chrome.tabs.sendMessage(e.tabId, message, function(response) {
          if (typeof response === 'undefined') {
            // The content script probably hasn't loaded yet
            // Add fallback to the message queue for this tab
            // Instead the content script must request image replacements once it is loaded
            tabMessages[e.tabId].push(message);
          }
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


})();

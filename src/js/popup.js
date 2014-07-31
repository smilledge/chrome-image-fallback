;(function() {

  var $ = require('./libs/jquery'),
      $form = $('#fallbackForm');


  /**
   * Setup the for / defaults
   */
  var initialize = function() {
    _getDefaultHost(function(curr) {
      $('[name="fallbackHost"]').val(curr);
    });
  };


  /**
   * On form submit action
   */
  $form.on('submit', function(e) {
    e.preventDefault();
    var fallbackHost = $('[name="fallbackHost"]').val();

    // Get the active tab's url
    _getActiveTab(function(activeTab) {

      // Save it to lacal storage
      chrome.storage.local.get(function(settings) {
        settings = settings || {};

        settings[_parseUrl(activeTab.url).hostname] = {
          fallback: fallbackHost,
          enabled: true
        };

        chrome.storage.local.set(settings, function() {
          // Reload the current tab and close the popup
          chrome.tabs.reload(activeTab.id);
          window.close();
        });
      });
    });
  });


  /**
   * Get the currently active tabs url
   */
  var _getActiveTab = function(callback) {
    chrome.tabs.query({
      active: true,
      windowId: chrome.windows.WINDOW_ID_CURRENT
    }, function(tabs) {
      callback(tabs[0]);
    });
  };


  /**
   * Get the default host for this host in local storage 
   */
  var _getDefaultHost = function(callback) {
    _getActiveTab(function(activeTab) {
      var activeHost = _parseUrl(activeTab.url).hostname;

      chrome.storage.local.get(function(settings) {
        callback(settings[activeHost].fallback);
      });
    });
  };


  /**
   * Parse a URL
   * https://gist.github.com/jlong/2428561
   */
  var _parseUrl = function(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
  };


  initialize();

})();

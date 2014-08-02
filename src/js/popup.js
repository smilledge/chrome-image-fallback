;(function() {

  var $ = require('./libs/jquery'),
      $form = $('#fallbackForm');


  /**
   * Setup the for / defaults
   */
  var initialize = function() {
    _getSettings(function(settings) {
      $('[name="fallbackHost"]').val(settings.fallback);
      if (settings.query && settings.query.styleSheets) {
        $('[name="styleSheets"]').prop('checked', true);
      }
    });
  };


  /**
   * On form submit action
   */
  $form.on('submit', function(e) {
    e.preventDefault();
    var fallbackHost = $('[name="fallbackHost"]').val(),
        queryStyleSheets = $('[name="styleSheets"]').prop('checked');

    // Get the active tab's url
    _getActiveTab(function(activeTab) {

      // Save it to lacal storage
      chrome.storage.local.get(function(settings) {
        settings = settings || {};

        settings[_parseUrl(activeTab.url).hostname] = {
          fallback: fallbackHost,
          query: {
            dom: true,
            styleSheets: queryStyleSheets
          },
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
  var _getSettings = function(callback) {
    _getActiveTab(function(activeTab) {
      var activeHost = _parseUrl(activeTab.url).hostname;

      chrome.storage.local.get(function(settings) {
        callback(settings[activeHost]);
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

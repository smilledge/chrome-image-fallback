;(function() {

  var $ = require('./vendor/jquery'),
      Settings = require('./libs/settings'),
      utils = require('./libs/utils'),
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

    // Get the active tab's url and save it's settings
    _getActiveTab(function(activeTab) {
      Settings.set(utils.parseUrl(activeTab.url).hostname, {
        fallback: fallbackHost,
        query: {
          dom: true,
          styleSheets: queryStyleSheets
        },
        enabled: true
      }, function() {
        chrome.tabs.reload(activeTab.id);
        window.close();
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
      var activeHost = utils.parseUrl(activeTab.url).hostname;
      Settings.get(activeHost, callback);
    });
  };


  initialize();

})();

;(function() {

  var $ = require('./libs/jquery');


  /**
   * Show all currently configured fallback hosts
   */
  chrome.storage.local.get(function(settings) {
    var template = [];
    for (var key in settings) {
      template.push('<tr><td>' + key + '</td><td>' + settings[key].fallback + '</td></tr>');
    }
    $('.activeFallbacks').append(template.join(''));
  });


  /**
   * Clear all settings
   */
  $('.btnClearSettings').on('click', function() {
    chrome.storage.local.clear(function() {
      window.location.href = window.location;
    });
  });

})();

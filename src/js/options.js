;(function() {

  var $ = require('./vendor/jquery'),
      Settings = require('./libs/settings');


  /**
   * Show all currently configured fallback hosts
   */
  Settings.get(function(settings) {
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
    Settings.clear(function() {
      window.location.href = window.location;
    });
  });

})();

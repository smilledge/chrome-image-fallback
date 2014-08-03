;(function() {

  module.exports = {

    /**
     * Load extension settings from localstorage
     * 
     * @param  {string}    key    (optional)
     * @param  {function}  callback
     */
    get: function(key, callback) {
      if (typeof callback === 'undefined') {
        callback = key;
        key = false;
      }

      chrome.storage.local.get(function(settings) {
        if (key) {
          return callback(settings[key]);
        }

        settings = settings || {};

        callback(settings);
      });
    },

    /**
     * Save settings to localstorage
     * 
     * @param  {string}    key
     * @param  {mixed}     value
     * @param  {function}  callback
     */
    set: function(key, value, callback) {
      module.exports.get(function(settings) {
        settings[key] = value;
        chrome.storage.local.set(settings, callback);
      });
    },

    /**
     * Remove all settings from localstorage
     * 
     * @param  {fucntion} callback
     */
    clear: function(callback) {
      chrome.storage.local.clear(callback);
    }

  };


})();

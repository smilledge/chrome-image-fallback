;(function() {

  var $ = require('./libs/jquery');

  /**
   * Request any fallback images from the background script
   */
  var initialize = function() {
    chrome.runtime.sendMessage({
      action: 'getImageFallbacks'
    }, function(response) {
      if (response && response.length) {
        response.forEach(function(replace) {
          _replaceImage(replace);
        });
      }
    });
  };
  

  var _replaceImage = function(replace) {
    $('[src$="'+ replace.target +'"]').attr('src', replace.fallback);
  };

  // Make sure the document is ready
  $(initialize);

})();

;(function() {

  var $ = require('./libs/jquery'),
      CssRuleExtractor = require('./libs/cssRuleExtractor'),
      backgoundImageExtractor = new CssRuleExtractor(document.styleSheets, 'backgroundImage');



  /**
   * Request any fallback images from the background script
   */
  var initialize = function() {
    chrome.runtime.sendMessage({
      action: 'getImageFallbacks'
    }, function(response) {
      if (response && response.length) {
        response.forEach(function(replace) {
          replaceMarkupImages(replace);
          replaceStyleSheetImages(replace);
        });
      }
    });
  };


  /**
   * Replace any image urls in the document's markup
   *
   * @param {object}  replace  Image target and fallback
   * @return {void}
   */
  var replaceMarkupImages = function(replace) {
    $('[src$="'+ replace.target +'"]').attr('src', replace.fallback);
  };


  /**
   * Replace images in any external stylesheet urls
   *
   * @param {object}  replace  Image target and fallback
   * @return {void}
   */
  var replaceStyleSheetImages = function(replace) {
    var extractedRules = backgoundImageExtractor.filterByValue(replace.target, false).extract();
    backgoundImageExtractor.reset();

    // Check if there were any matching CSS rules defined
    if (!extractedRules.length) {
      return;
    }

    // Create a new stylesheet and add the modified extracted rules
    var styleNode = document.createElement("style"),
        commentNode = document.createComment("Image Fallback: (" + replace.target + ' -> ' + replace.fallback + ")");
    
    document.head.appendChild(commentNode);
    document.head.appendChild(styleNode);
    
    // Add the CSS rules to the new stylesheet
    var sheet = styleNode.sheet;
    extractedRules.forEach(function(rule) {
      sheet.insertRule(rule.selectorText + '{background-image:url(' + replace.fallback + ');}', sheet.cssRules.length);
    });
  };


  // Make sure the document is ready
  $(initialize);


})();

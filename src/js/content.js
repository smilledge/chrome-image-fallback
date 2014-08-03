;(function() {

  var $ = require('./vendor/jquery'),
      Settings = require('./libs/settings'),
      CssRuleExtractor = require('./libs/cssRuleExtractor'),
      backgoundImageExtractor = new CssRuleExtractor(document.styleSheets, 'backgroundImage');



  /**
   * Request any fallback images from the background script
   */
  var initialize = function() {
    Settings.get(document.location.hostname, function(settings) {

      // Get any replacements which were sent before this script was loaded
      chrome.runtime.sendMessage({
        action: 'getImageFallbacks'
      }, function(response) {
        if (!response || !response.length) {
          return;
        }

        response.forEach(function(replace) {
          replaceMarkupImages(replace);
          if (settings.query && settings.query.styleSheets) {
            replaceStyleSheetImages(replace);
          }
        });
      });

      // Listen for new replacements (images that were dynamically loaded)
      chrome.runtime.onMessage.addListener(function(replace, sender, sendResponse) {
        replaceMarkupImages(replace);
        if (settings.query && settings.query.styleSheets) {
          replaceStyleSheetImages(replace);
        }

        sendResponse({
          success: true
        });
      });

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
      sheet.insertRule(_buildCssRule(rule, replace.fallback), sheet.cssRules.length);
    });
  };


  /**
   * Build a CSS rule string from a CSSStyleRule
   *
   * @param {CSSStyleRule}
   * @return {string}
   */
  var _buildCssRule = function(rule, url) {
    var output = "",
        hasMedia = rule.parentRule && rule.parentRule.media;

    if (hasMedia) {
      output += '@media ' + rule.parentRule.media.mediaText + ' {';
    }

    output += rule.selectorText + '{ background-image: url(' + url + '); }';

    if (hasMedia) {
      output += '}';
    }

    return output;
  };


  // Make sure the document is ready
  $(initialize);


})();

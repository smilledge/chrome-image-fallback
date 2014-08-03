;(function() {

  /**
   * CssRuleExtractor constructor
   * 
   * @param  {array}  stylesheets  array of CSSStyleSheet objects
   * @param  {string}  defaultProperty  default css property you are filtering on
   * 
   * @class  CssRuleExtractor
   */
  var CssRuleExtractor = function(styleSheets, defaultProperty) {
    this.styleSheets = _filterActiveStyleSheets(styleSheets);
    this.rules = _aggregateStyleSheetRules(this.styleSheets);

    if (defaultProperty) {
      this._defaultProperty = defaultProperty;
      this._property = defaultProperty;
      this.filterByProperty.call(this, defaultProperty);
    }

    this._rules = this.rules;
  };


  /**
   * Filter rules that have a defined value for the provided property
   *
   * @param  {string}  propName  name for the CSS property
   * @chainable
   */
  CssRuleExtractor.prototype.filterByProperty = function(propName) {
    this._property = propName;

    this.rules = this.rules.filter(function(rule) {
      return rule.style && rule.style[propName];
    });

    return this;
  };


  /**
   * Filter rules that match the provided value
   *
   * @param  {string}  propValue  value of the CSS property
   * @param  {boolean}  exact  is an exact match required or just contains the string (default true)
   * @chainable
   */
  CssRuleExtractor.prototype.filterByValue = function(propValue, exact) {
    if (!this._property) {
      throw new Error("You have not provided a property to filter on.");
    }

    if (typeof exact === 'undefined') {
      exact = true;
    }

    this.rules = this.rules.filter(function(rule) {
      if (exact) {
        return rule.style[this._property] === propValue;
      } else {
        return rule.style[this._property].indexOf(propValue) !== -1;
      }
    }.bind(this));

    this._property = null;

    return this;
  };


  /**
   * Find any matching CSSStyleRules
   *
   * @param  {string}  prop  CSS style property
   * @param  {string}  value  the CSS style property's value
   * @return  {array}  array of CSSStyleRule
   */
  CssRuleExtractor.prototype.extract = function() {
    return this.rules;
  };


  /**
   * Reset any active rule filters
   * 
   * @chainable
   */
  CssRuleExtractor.prototype.reset = function() {
    this.rules = this._rules;
    this._property = this._defaultProperty;
    return this;
  };


  /**
   * Find the stylesheets that are not disabled and have cssRules
   *
   * @param  {array}  styleSheets
   * @return  {array}
   */
  var _filterActiveStyleSheets = function(styleSheets) {
    if (styleSheets.constructor.name === 'StyleSheetList') {
      styleSheets = Array.prototype.slice.call(styleSheets);
    }

    return styleSheets.filter(function(styleSheet) {
      return (!styleSheet.disabled && styleSheet.cssRules);
    });
  };


  /**
   * Return all CSSStyleRule from the stylesheets
   * 
   * @return {array}
   */
  var _aggregateStyleSheetRules = function(styleSheets) {
    var rules = [];

    for (var i = 0, len = styleSheets.length; i < len; i++) {
      var cssRules = styleSheets[i].cssRules,
          mediaRules = [];

      // CSSMediaRule has a child cssRules that needs to be added the the rules array
      for (var j = 0, mLen = cssRules.length; j < mLen; j++) {
        if (cssRules[j].constructor.name === 'CSSMediaRule') {
          mediaRules = mediaRules.concat(Array.prototype.slice.call(cssRules[j].cssRules));
        }
      }

      rules = rules.concat(Array.prototype.slice.call(cssRules), mediaRules);
    }

    return rules;
  };


  module.exports = CssRuleExtractor;

})();

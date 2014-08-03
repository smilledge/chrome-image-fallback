;(function() {


  module.exports = {

    /**
     * Parse a URL
     * https://gist.github.com/jlong/2428561
     *
     * @param  {string}  url
     * @return {object}
     */
    parseUrl: function(url) {
      var parser = document.createElement('a');
      parser.href = url;
      return parser;
    }

  };


})();

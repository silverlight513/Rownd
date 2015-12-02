/**
 *
 * rmain.js holds all of the code for the Rownd project
 *
 * Author: Jack Rimell @silverlight513
 *
 */
(function(app) {

  // Console.log handler
  var log = function() {
    if(console && console.log.apply) {
      console.log.apply(console, arguments);
    }
  };

  // Console.error handler
  var error = function() {
    if(console && console.error.apply) {
      console.error.apply(console, arguments);
    }
  };

  // Console.debug handler
  var debug = function() {
    if(console && console.debug.apply) {
      console.debug.apply(console, arguments);
    }
  };

}(this.Rownd = this.Rownd || {}));
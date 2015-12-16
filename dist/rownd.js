/*
 * rownd - v0.0.1 - 2015-12-16
 * By Jack Rimell - Copyright (c) 2015 Jack Rimell;
*/
(function(app) {

  // Create vars needed
  var routes = {};

  // Console.error handler
  var error = function() {
    if(console && console.error.apply) {
      console.error.apply(console, arguments);
    }
  };

  /*
   * Creates a new route for the route object
  */
  app.createRoute = function(route) {
    // Check if the path property exists
    if(!route.path) {
      error('Path value is missing from a route object');
    }

    // If the user has a blank path assume base url
    if(route.path === '') {
      route.path = '/';
    }

    // Check if the name of the controller is given
    if(route.hasOwnProperty('controller') === false) {
      error('Controller value is missing from a route object');
    } else if(route.controller.length === 0) {
      error('Controller value is empty in a route object');
    }

    // Add the new route values to the route object
    routes[route.path] = route.controller;
  };

  /*
   * Creates a contoller object for a route to fire
  */
  app.createController = function() {

  };

  /*
   * Predefines the Helpers object
  */
  app.Helpers = (function(){
    return {};
  });


}(this.Rownd = this.Rownd || {}));
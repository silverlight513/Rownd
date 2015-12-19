/**
 *
 * main.js holds all of the code for the Rownd project
 *
 * Author: Jack Rimell @silverlight513
 *
 */
(function(app) {

  // Create vars needed
  var routes = {};
  var accessableControllers = {};


  /**
   * @description, Function to shout out errors at bad people
   */
  var error = function() {
    if(console && console.error.apply) {
      console.error.apply(console, arguments);
    }
  };


  /**
   * @description, Adds a new route to the route object
   * @param {String} path, The path of the given route
   * @param {String} controller, The name of the controller for the specified route
   */
  var addRoute = function(path, controller) {

    // Check if the path property exists
    if(!path) {
      error('Path value is missing from a route object');
    }

    // If the user has a blank path assume base url
    if(path === '') {
      path = '/';
    }

    // Check if the name of the controller is given
    if(!controller) {
      error('Controller value is missing from a route object');
    } else if(controller.length === 0) {
      error('Controller value is empty in a route object');
    }

    routes[path] = controller;
  };


  /**
   * @param  {object} route, The object that contains path and the controller name
   * @return {}
   */
  app.createRoute = function(route) {

    // Add the new route values to the route object
    return addRoute(route.path, route.controller);
  };


  /**
   * @param  {String} controllerName, The name of the controller given
   * @param  {Object} controller, The controller object that contains the view, controller and action objects
   * @return {}
   */
  app.createController = function(controllerName, controller) {
    // Initialise the controller
    accessableControllers[controllerName] = controller;

    return accessableControllers[controllerName];
  };


  /**
   * @description, Sets up the helpers object so it's ready to be used
   */
  app.Helpers = (function(){
    return {};
  });


}(this.Rownd = this.Rownd || {}));
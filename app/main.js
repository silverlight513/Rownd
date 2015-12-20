/**
 *
 * main.js holds all of the code for the Rownd project
 *
 * Author: Jack Rimell @silverlight513
 *
 */
(function(Rownd) {

  // Create vars needed
  var routes = {};
  var accessableControllers = {};
  var previousHash;
  var currentHash;


  /**
   * @description, Function to shout out errors at bad people
   */
  var error = function() {
    if(console && console.error.apply) {
      console.error.apply(console, arguments);
    }
  };

  /**
   * @param  {String} text, The string that will be searched
   * @param  {String} character, The character to find in the string
   * @return {Boolean}, If the character is found at the beginning of the string
   */
  var startsWith = function(text, character) {
    return text.indexOf(character) === 0;
  };

  /**
   * @param  {String} text, The string that will be searched
   * @param  {String} character, The character to find in the string
   * @return {Boolean}, If the character is found at the end of the string
   */
  var endsWith = function(text, character){
    return text.charAt(text.length - 1) === character;
  };

  /**
   * @param  {String} hash, The url to be checked if it's a hash or real path
   * @return {String}, The string without the hash if it was a hash
   */
  var hashOrPath = function(hash) {
    if(startsWith(hash, '/#!')){
      hash = hash.slice(3);
    } else if(startsWith(hash, '/#/')){
      hash = hash.slice(2);
    } else if(startsWith(hash, '#')){
      hash = hash.slice(1);
    }

    if(hash.indexOf('#') > -1){
      hash = hash.split('#')[0];
    }

    return hash;
  };

  /**
   * @description, Gets a route object that matches the given path
   * @param  {String} path,
   * @return {[type]}
   */
  var findMatchingRoute = function(path) {
    // Loop through the routes object and find a matching path
    for(var key in routes) {
      if(routes.hasOwnProperty(key)) {
        // If they key matches the path then use that route object
        if(key === path) {
          var matchedRoute = {'path': key, 'controller': routes[key]};
          return matchedRoute;
        } else {
          return false;
        }
      }
    }
  };

  /**
   * @description, Gets the current pages hash
   * @return {String}, The new hash
   */
  var getNewHash = function() {
    var hash = hashOrPath(window.location.host.length > 0 ? window.location.href.split(window.location.host)[1] : window.location.href);

    // Remove trailing slash
    if(hash.length > 1 && endsWith(hash, '/')){
      hash = hash.slice(0, -1);
    }

    // Return a non query version of the url
    return hash.split('?')[0];
  };

  /**
   * @description, Loops through the routes object and clears all routes to be non-active
   */
  var clearActiveRoutes = function() {
    for(var key in routes) {
      if(routes[key] && routes[key].active) {
        routes[key].active = false;
      }
    }
  };

  var runController = function() {
    // YOURE AT THIS BIT!!!!!!!!!!!
  };


  /**
   * @description, The function that fires a controller depending on what the current path is
   * @param {newPath} newPath, The new path after clicking a link or using nav buttons
   */
  var navChange = function(newPath) {

    // Update the previously stored hash
    previousHash = currentHash;

    // Get the new hash from param or function
    if(!newPath) {
      currentHash = getNewHash();
    } else {
      currentHash = newPath.split('?')[0];
    }

    // Find the route from the routes object
    var matchedRoute = findMatchingRoute(currentHash);

    // If a matched route could be found; fire controller and set as active
    if(matchedRoute) {

      // Clear all prevously active routes
      clearActiveRoutes();

      // Set the matched route as active
      matchedRoute.active = true;

      runController(matchedRoute.controller);
    } else {
      // Tell the user the new paths does not match any paths in the routes object
      error('Cannot find current route');

      // Clear all the active routes
      clearActiveRoutes();
    }
  };


  /**
   * @description, Adds a new route to the route object
   * @param {String} path, The path of the given route
   * @param {String} controller, The name of the controller for the specified route
   */
  var addRoute = function(path, controller) {

    // If the user has a blank path assume base url
    if(path === '') {
      path = '/';
    }

    // Check if the path property exists
    if(!path) {
      error('Path value is missing from a route object');
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
  Rownd.createRoute = function(route) {

    // Add the new route values to the route object
    return addRoute(route.path, route.controller);
  };


  /**
   * @param  {String} controllerName, The name of the controller given
   * @param  {Object} controller, The controller object that contains the view, controller and action objects
   * @return {}
   */
  Rownd.createController = function(controllerName, controller) {
    // Initialise the controller
    accessableControllers[controllerName] = controller;

    return accessableControllers[controllerName];
  };

  /**
   * @description, Allow the access of all available routes and controllers for debugging in the console
   */
  Rownd.routes = routes;
  Rownd.controllers = accessableControllers;


  /**
   * @description, Initializes and runs Rownd
   */
  var hasDomContentLoaded = false;
  var initFinished = false;

  var initialize = function() {
    console.log('Initializing Rownd');
    navChange();
  };

  // Used to detect init of page for > ie8
  document.addEventListener('DOMContentLoaded', function() {
    if(!initFinished) {
      initialize();
      initFinished = true;
    }
    hasDomContentLoaded = true;
  });

  // Used to detect init of page for < ie9
  if(!hasDomContentLoaded) {
    document.addEventListener('readystatechange', function() {
      if(!initFinished) {
        initialize();
        initFinished = true;
      }
    }, false);
  }


}(this.Rownd = this.Rownd || {}));
/**
 *
 * main.js holds all of the code for the Rownd project
 *
 * Author: Jack Rimell @silverlight513
 *
 */
(function(Rownd) {

  // Create vars needed
  var routes = [];
  var accessableControllers = {};
  var previousHash;
  var currentHash;

  // Set up the config screen so you can
  var config = {
    'debug': true,
    'hideInfo': false,
    'showVersion': true
  };

  // Namespace to store controllers upon set up
  Rownd.controllers = {};


  /**
   * @description, Function to shout out errors at bad people
   */
  var error = function() {
    if(console && console.error.apply && config.debug) {
      console.error.apply(console, arguments);
    }
  };


  /**
   * @description, Function to warn people of the things
   */
  var info = function() {
    if(console && console.info.apply && !config.hideInfo) {
      console.info.apply(console, arguments);
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
   * @description, Updates all of the configurations when starting Rownd
   * @param  {Object} config, An object of all the configs
   */
  Rownd.start = function(newConfig) {
    for(var key in newConfig) {
      if(newConfig.hasOwnProperty(key) && config.hasOwnProperty(key)) {
        config[key] = newConfig[key];
      }
    }

    // Disable debug mode for ractive if user sets debug to false
    if(!config.debug) {
      Ractive.DEBUG = false;
    }

    return this;
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
   * @param  {String} path, The current url of the user
   * @return {[type]}, The matched route object
   */
  var findMatchingRoute = function(path) {
    // Loop through the routes object and find a matching path
    for (var i = routes.length - 1; i >= 0; i--) {

      // If the route doesn't have any dynamic parts to it
      if(routes[i].path === path) {
        return routes[i];
      }

      // If the route has a dynamic section convert both paths to find match
      var splitRoute = routes[2].path.split('/');
      splitRoute = splitRoute.splice(1, splitRoute.length);

      var splitPath = path.split('/');
      splitPath = splitPath.splice(1, splitPath.length);

      // Object to store the params of the route
      var params = {};
      var matchedRoute = {};

      // Loop over each part of the paths
      for (var j = splitRoute.length - 1; j >= 0; j--) {

        // If this part is dynamic add the value to params and go to next part
        if(splitRoute[j].indexOf(':') > -1  ) {
          params[splitRoute[j].substring(1)] = splitPath[j];
          // If this is the last part of the path then return the matched route
          if(j === 0) {
            matchedRoute = {path: routes[i].path, controller: routes[i].controller, params: params};
            return matchedRoute;
          }
          // Continue to the next part of the path
          continue;
        }

        // If this doesn't match then go to next route item
        if(splitRoute[j] !== splitPath[j]) {
          break;
        }

        // If it's the last item and it matches, return the matched route with it's params
        if(splitRoute[j] === splitPath[j] && j === 0) {
          matchedRoute = {path: routes[i].path, controller: routes[i].controller, params: params};
          return matchedRoute;
        }
      }
    }

    // No matching route was found (error message displayed in outer function)
    return false;
  };


  /**
   * @description, Gets the current pages path or hash
   * @return {String}, The new path or hash
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
   * @description, Loops through the routes array and clears all routes to be non-active
   */
  var clearActiveRoutes = function() {
    for (var i = routes.length - 1; i >= 0; i--) {
      if(routes[i].active) {
        routes[i].active = false;
      }
    }
  };

  /**
   * @description, The function used to render a handlebars template with data
   * @param  {Object} template, The object with all of the details needed to render the handlebars and attach data
   * @return {Object}, Returns a Ractive object that will populate the DOM
   *
   */
  Rownd.generateTemplate = function(template) {

    // If no location for the template given then use the body
    if(!template.outlet) {
      template.outlet = 'body';
    }

    // Check if the user didn't use the append value
    if(typeof template.append === 'undefined') {
      template.append = false;
    }

    // Allow the templates to be used as partials inside other templates
    if(JSON.stringify(Ractive.partials) === '{}'){
      Ractive.partials = Rownd.templates;
    }

    if(template.template) {
      // Set up the params needed for the Ractive object
      var templateObject = {
        el: template.outlet,
        template: Rownd.templates[template.template],
        append : template.append
      };

      // Add data if it is given in the parameters
      if(typeof template.data !== undefined) {
        templateObject.data = template.data;
      }

      return new Ractive(templateObject);

    } else {
      error('Unable to find a matching template for - ' + template.template);
      return false;
    }

  };


  /**
   * @description, Find and run the controller
   * @param  {String} controllerName, The name of the controller that needs to be fired
   * @param {Object} controller, The controller object given to the create controller function
   * @param {String} path, The path at which the controller is firing for
   * @return {Function}, The controller that is fired
   */
  var runController = function(controllerName, controller, routeData) {

    if(!controllerName) {
      error('A specified controller is missing for the route - ' + routeData.path);
      return false;
    }

    if(!controller) {
      error('Unable to find the "'+ controllerName +'" controller');
      return false;
    }

    // Create a namespace for the conroller in Rownd
    Rownd.controllers[controllerName] = {};

    // Generate and add the template to the controller using the view object if present
    if(controller.view) {
      Rownd.controllers[controllerName] = Rownd.generateTemplate(controller.view);
    } else {
      error('The view object is missing from controller - ' + controllerName);
      return false;
    }

    // Add the controller function to the new controller object
    if(controller.controller) {
      Rownd.controllers[controllerName].controller = controller.controller;
    } else {
      error('The controller function is missing from controller - ' + controllerName);
    }

    // Add the actions to the new controller function
    if(controller.actions) {
      Rownd.controllers[controllerName].on(controller.actions);
    }

    // Run the controller
    Rownd.controllers[controllerName].controller(routeData);
    return Rownd.controllers[controllerName];
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

      runController(matchedRoute.controller, accessableControllers[matchedRoute.controller], matchedRoute);
    } else {
      // Checker to stop logging when running tests in Phantom browser
      if(typeof newPath === undefined) {
        // Tell the user the new paths does not match any paths in the routes object
        error('Cannot find current route');

        // Clear all the active routes
        clearActiveRoutes();
      }
    }
  };


  /**
   * @description, Adds a new route to the routes array
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
      return false;
    }

    // Check if the name of the controller is given
    if(typeof controller === 'undefined') {
      error('Controller value is missing from a route object');
      return false;
    } else if(controller.length === 0) {
      error('Controller value is empty in a route object');
      return false;
    }
    // Push new route to the routes array
    routes.push({'path': path, 'controller': controller});
  };


  /**
   * @param  {object} route, The object that contains path and the controller name
   */
  Rownd.createRoute = function(route) {
    // Add the new route values to the route object
    return addRoute(route.path, route.controller);
  };


  /**
   * @param  {String} controllerName, The name of the controller given
   * @param  {Object} controller, The controller object that contains the view, controller and action objects
   */
  Rownd.createController = function(controllerName, controllerObject) {
    // Initialise the controller
    accessableControllers[controllerName] = controllerObject;

    return accessableControllers[controllerName];
  };

  /**
   * @description, Sets up the helpers object so it's ready to be used
   */
  Rownd.Helpers = (function(){
    return {};
  });

  /**
   * @description, Allow the access of all available routes for debugging in the console
   */
  Rownd.routes = routes;

  /**
   * @description, Listens to when there was a hashchange made when there is no history mode enabled
   */
  window.addEventListener('hashchange', function() {
    if(!config.useHistory || !window.history) {
      navChange();
    }
  }, false);


  /**
   * @description, Initializes and runs Rownd
   */
  var hasDomContentLoaded = false;
  var initFinished = false;

  var initialize = function() {
    info('Initializing Rownd');
    // Need to somehow auto update number
    if(config.showVersion){
      info('Running Rownd v0.2.0');
    }

    // Function for loading new page
    navChange();

    // TODO: Add history mode
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
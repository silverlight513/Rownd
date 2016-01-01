/**
 *
 *  List of tests for the Rownd main.js file
 *
 */

/**
 * @description, Starting Rownd with all config options
 */
describe('Starting Rownd with configs', function() {
  it('should loop through and update the configs', function() {
    // Run the start function
    Rownd.start({
      'debug' : true,
      'hideInfo' : false,
      'showVersion' : true
    });
  });
});


/**
 * @description, Checks that the helpers object is empty at initialization
 */
describe('Initializing helpers', function() {
  it('should return an empty Object', function() {
    // assert.deepEqual(Rownd.Helpers(), {}, 'Helpers are not empty or undefined');
    expect(Rownd.Helpers()).to.deep.equal({});
  });
});


/**
 * @description, Create a new route with a missing controller parameter to throw error
 */
describe('Creating a broken route', function() {
  it('missing controller should stop creation of route', function() {
    Rownd.createRoute({
      path: '/helo'
    });
    expect(Rownd.routes.length).to.equal(0);
  });

  it('missing path should stop creation of route', function() {
    Rownd.createRoute({
      controller: 'cyntaf'
    });
    expect(Rownd.routes.length).to.equal(0);
  });

  it('empty controller should stop creation of route', function() {
    Rownd.createRoute({
      path: '/hwyl',
      controller: ''
    });
    expect(Rownd.routes.length).to.equal(0);
  });
});


/**
 * @description, Creating and index route and checking the relevant objects have been created
 */
describe('Creating an index route', function() {
  it('should have a matching controller in the routes object', function() {
    Rownd.createRoute({path: '', controller: 'index'});
    expect(Rownd.routes[0].controller).to.equal('index');
  });

  it('should have a matching path in the routes object', function() {
    expect(Rownd.routes[0].path).to.equal('/');
  });
});
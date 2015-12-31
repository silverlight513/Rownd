/**
 *
 *  List of tests for the Rownd main.js file
 *
 */



/**
 * @description, Checks that the helpers object is empty at initialization
 */
describe('Initializing helpers', function() {
  it('should return an empty Object', function() {
    expect(JSON.stringify(Rownd.Helpers())).to.equal('{}');
  });
});

/**
 * @description,
 */
describe('creating an index route', function() {
  it('should have a matching controller in the routes object', function() {
    Rownd.createRoute({path: '/', controller: 'index'});
    expect(Rownd.routes[0].controller).to.equal('index');
  });

  it('should have a matching path in the routes object', function() {
    expect(Rownd.routes[0].path).to.equal('/');
  });
});
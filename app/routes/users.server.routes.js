// Load the 'users' controller
var users = require('../../app/controllers/users.server.controller');
var express = require('express');
var router = express.Router();
// Define the routes module' method
module.exports = function (app) {
    // handle a get request made to /users path
    // and list users when /users link is selected
    app.get("/userst",users.requiresLogin,users.list); //go to http://localhost:3000/users to see the list
    //handle a post request made to root path
    app.post('/t', users.create);
    //
    // Set up the 'users' parameterized routes 
	app.route('/userst/:userId')
    .get(users.read)
    .put(users.update)
    .delete(users.delete)
    // Set up the 'userId' parameter middleware
    //All param callbacks will be called before any handler of 
    //any route in which the param occurs, and they will each 
    //be called only once in a request - response cycle, 
    //even if the parameter is matched in multiple routes
    app.param('userId', users.userByID);
    //authenticate user
    app.post('/signint', users.authenticate);
    app.get('/signoutt', users.signout);
    app.get('/read_cookiet', users.isSignedIn);


    //path to a protected page
	app.get('/welcomet',users.welcome);
    
};


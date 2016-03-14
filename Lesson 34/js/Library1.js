// check for the unique var name - if it exists, return it
// if it does not exist - return a new empty object
// this defines a unique namespace - prefix for your methods
var SomeUncommonWordOrName = SomeUncommonWordOrName || {};

// add a method to this namespace
SomeUncommonWordOrName.sayHello = function() {
	console.log('hello from library1');
};


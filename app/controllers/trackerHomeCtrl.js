"use strict";

app.controller("trackerHomeCtrl", function($scope, AuthFactory){

	$scope.loggedIn = AuthFactory.isAuthenticated();
	// console.log("user auth?", AuthFactory.isAuthenticated());


	// if (AuthFactory.isAuthenticated() === true){

	// 	console.log("true!" );

	// } else {
	// 	console.log("nope!" );
	// }


});
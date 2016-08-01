"use strict";

app.controller("loginCtrl", function($scope, AuthFactory){

	$scope.registerMode = true;

	$scope.activateRegisterMode = function(){
		$scope.registerMode = true;
	};

	$scope.activateLoginMode = function(){
		$scope.registerMode = false;
	};

	//register function


	//login function
	// AuthFactory.authWithProvider()
 //    .then(function(result) {
 //      var user = result.user.uid;
 //      console.log("logged in user fer sure", user);
 //      // Load to dos?
 //      $location.path("/");
 //      $scope.$apply();
 //    }).catch(function(error) {
 //      // Handle Errors here.
 //      var errorCode = error.code;
 //      var errorMessage = error.message;
 //      // The email of the user's account used.
 //      var email = error.email;
 //      // The firebase.auth.AuthCredential type that was used.
 //      var credential = error.credential;
 //      // ...
 //    });


});
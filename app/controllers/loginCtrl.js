"use strict";

app.controller("loginCtrl", function($scope, AuthFactory, $location){



	//register function



	// login function
	$scope.login = function(){
	AuthFactory.authWithProvider()
		.then(function(result){
      var user = result.user.uid;
      console.log("logged in user fer sure", user);
			$location.path("/selectTrail");
			$scope.$apply();
		});
	};



});
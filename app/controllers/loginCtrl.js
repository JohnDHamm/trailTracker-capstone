"use strict";

app.controller("loginCtrl", function($scope, AuthFactory, $location, DatabaseFactory){

	let user = "";
	let userName = "";
	$scope.showRegister = false;



	// login function
	$scope.loginWithGoogle = function(){
	AuthFactory.authWithProvider()
		.then(function(result){
      user = result.user.uid;
      console.log("logged in user fer sure", user);

      //check if existing user
      DatabaseFactory.getUsers()
	      .then(function(userList){
	      	console.log("userList", userList);
	      	$scope.regUser = false;
	      	for (let i = 0; i < userList.length; i++) {
	      		console.log("userId", userList[i].userId);
		      	if (user === userList[i].userId) {
		      		$scope.regUser = true;
		      	}
	      	}
	      	if ($scope.regUser) {
		    		//go to trails page
		    		$location.path("/selectTrail");
						// $scope.$apply();
	      	} else {
	      		$scope.showRegister = true;
    				console.log("please register" );
	      	}
	      });
		});
	};


	//register function - add user with userName to FB
	$scope.registerUser = function(){
		let newUser = {userId: user, userName: $scope.userName};
		DatabaseFactory.addUser(newUser)
			.then(function(){
				//go to trails page
				console.log("user registered - go to trails");
				$location.path("/selectTrail");
			});
	};
});
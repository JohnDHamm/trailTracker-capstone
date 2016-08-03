"use strict";

app.controller("loginCtrl", function($scope, AuthFactory, $location, DatabaseFactory, Upload, StorageFactory){

	let userId = "";
	let userName = "";
	$scope.showRegister = false;



	// login function
	$scope.loginWithGoogle = function(){
	AuthFactory.authWithProvider()
		.then(function(result){
      userId = result.user.uid;
      // console.log("logged in user fer sure", user);

      //check if existing user
      DatabaseFactory.getUsers()
	      .then(function(userList){
	      	// console.log("userList", userList);
	      	$scope.regUser = false;
	      	// change this to forEach loop
	      	for (let i = 0; i < userList.length; i++) {
		      	if (userId === userList[i].userId) {
		      		$scope.regUser = true;
		      		AuthFactory.setCurrentUser(userList[i]);
		      	}
	      	}
	      	if ($scope.regUser) {
		    		//go to trails page
		    		$location.path("/selectTrail");
						// $scope.$apply();
	      	} else {
	      		$scope.showRegister = true;
	      	}
	      });
		});
	};


	//register function - add user with userName to FB
	$scope.registerUser = function(){
		let newUser = {userId: userId, userName: $scope.userName};
		DatabaseFactory.addUser(newUser)
			.then(function(){
				//go to trails page
				AuthFactory.setCurrentUser(newUser);
				$location.path("/selectTrail");
			});
	};

	$scope.uploadImg = function(file){
		console.log(file.name);
		StorageFactory.uploadTask(file, StorageFactory.getMetadata());
	};

});
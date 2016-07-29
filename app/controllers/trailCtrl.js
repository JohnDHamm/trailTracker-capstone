"use strict";

app.controller("trailCtrl", function($scope, $routeParams,DatabaseFactory){

	// get all trails then filter to just the trail with the path Id
	$scope.trailList = [];
	let selectedTrailId = "";

	DatabaseFactory.getTrailList()
		.then(function(trails){
			$scope.trailList =  trails;

	 	$scope.selectedTrail = $scope.trailList.filter(function(trail){
	 		return trail.trailId === $routeParams.trailId;
	 	})[0];

	 	selectedTrailId = $scope.selectedTrail.trailId;
	 	console.log("selectedTrailId", selectedTrailId);
	})
		.then(function(){
			// get posts with selected trail Id

			DatabaseFactory.getTrailPosts(selectedTrailId)
				.then(function(posts){
					console.log("posts", posts);
					$scope.posts = posts;
				});
			
		});


	// get map 





	// get weather








});

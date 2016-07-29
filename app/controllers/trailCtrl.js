"use strict";

app.controller("trailCtrl", function($scope, $routeParams,DatabaseFactory, MapFactory, uiGmapGoogleMapApi){

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


// .controller("someController", function($scope, uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {

    });




	// get weather








});

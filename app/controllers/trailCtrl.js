"use strict";

app.controller("trailCtrl", function($scope, $routeParams, DatabaseFactory, WeatherFactory, uiGmapGoogleMapApi){

	// get all trails then filter to just the trail with the path Id
	$scope.trailList = [];
	$scope.weather = {};
	let selectedTrailId = "";
	let selectedTrail = {};

	DatabaseFactory.getTrailList()
		.then(function(trails){
			$scope.trailList =  trails;
			//filter to get selected trail
		 	$scope.selectedTrail = $scope.trailList.filter(function(trail){
		 		return trail.trailId === $routeParams.trailId;
		 	})[0];

		 	//define map parameters
		 	$scope.map = { center: { latitude: $scope.selectedTrail.latitude, longitude: $scope.selectedTrail.longitude }, zoom: $scope.selectedTrail.mapZoom, control: {} };
		 	//get current weather
		 	setWeather();

			// get posts with selected trail Id
		 	selectedTrailId = $scope.selectedTrail.trailId;

				return DatabaseFactory.getTrailPosts(selectedTrailId);
			})
			.then(function(posts){
						$scope.posts = posts;

					// ********* GET GOOGLE MAP *************************
			    // uiGmapGoogleMapApi is a promise.
			    // The "then" callback function provides the google.maps object.

			    uiGmapGoogleMapApi.then(function(maps) {
			    });

				});

	let setWeather = function(){
		WeatherFactory.getCurrentWeather($scope.selectedTrail.latitude, $scope.selectedTrail.longitude)
			.then(function(weather){
				$scope.$apply(function(){
					$scope.weather = weather.current_observation;
				});
			});
	};

});

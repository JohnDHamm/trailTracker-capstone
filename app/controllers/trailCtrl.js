"use strict";

app.controller("trailCtrl", function($scope, $routeParams,DatabaseFactory, WeatherFactory, uiGmapGoogleMapApi){

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
			})
				.then(function(){
				// ********* GET GOOGLE MAP *************************
			    // Do stuff with your $scope.
			    // Note: Some of the directives require at least something to be defined originally!
			    // e.g. $scope.markers = []
			    console.log("selected trail still there?", $scope.selectedTrail);
			    console.log("lat", $scope.selectedTrail.latitude);
			    console.log("long", $scope.selectedTrail.longitude);


			    $scope.map = { center: { latitude: $scope.selectedTrail.latitude, longitude: $scope.selectedTrail.longitude }, zoom: $scope.selectedTrail.mapZoom };

			    // uiGmapGoogleMapApi is a promise.
			    // The "then" callback function provides the google.maps object.
			    uiGmapGoogleMapApi.then(function(maps) {
		    		});

				})
					.then(function(){

					// ********* GET WEATHER *************************
					console.log("get the current weather");
					console.log("lat", $scope.selectedTrail.latitude);
			    console.log("long", $scope.selectedTrail.longitude);

					WeatherFactory.getCurrentWeather($scope.selectedTrail.latitude, $scope.selectedTrail.longitude)
						.then(function(weather){
							console.log("weather", weather);
							$scope.weather = weather.current_observation;
						});

					});








});

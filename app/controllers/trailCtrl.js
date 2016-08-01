"use strict";

app.controller("trailCtrl", function($scope, $routeParams, $location, DatabaseFactory, WeatherFactory, uiGmapGoogleMapApi, uiGmapIsReady){

	// get all trails then filter to just the trail with the path Id
	$scope.trailList = [];
	// $scope.weather = {};
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
		 	// console.log("selectedTrailId", selectedTrailId);
		 	console.log("setting map scope");
		 	$scope.map = { center: { latitude: $scope.selectedTrail.latitude, longitude: $scope.selectedTrail.longitude }, zoom: $scope.selectedTrail.mapZoom, control: {} };
		 	console.log("map", $scope.map);

		 	setWeather();

			// get posts with selected trail Id

				return DatabaseFactory.getTrailPosts(selectedTrailId);
			})
			.then(function(posts){
						console.log("map then");
						$scope.posts = posts;
				// ********* GET GOOGLE MAP *************************
			    // Do stuff with your $scope.
			    // Note: Some of the directives require at least something to be defined originally!
			    // e.g. $scope.markers = []
			    // console.log("selected trail still there?", $scope.selectedTrail);
			    // console.log("lat", $scope.selectedTrail.latitude);
			    // console.log("long", $scope.selectedTrail.longitude);


			    // $scope.map = { center: { latitude: $scope.selectedTrail.latitude, longitude: $scope.selectedTrail.longitude }, zoom: $scope.selectedTrail.mapZoom };

			    // uiGmapGoogleMapApi is a promise.
			    // The "then" callback function provides the google.maps object.

			    uiGmapGoogleMapApi.then(function(maps) {
			    });

			    // uiGmapIsReady.promise().then(function(map_instances) {
			    // 	let map1 = $scope.map.control.getGMap();
			    // 	let map2 = map_instances[0].map;
		    	// 	});

				});

	let setWeather = function(){
		// ********* GET WEATHER *************************
		// console.log("get the current weather");
		// console.log("lat", $scope.selectedTrail.latitude);
  //   console.log("long", $scope.selectedTrail.longitude);

		WeatherFactory.getCurrentWeather($scope.selectedTrail.latitude, $scope.selectedTrail.longitude)
			.then(function(weather){
				$scope.$apply(function(){
					$scope.weather = weather.current_observation;
					console.log("weather", $scope.weather);
					console.log("temp", $scope.weather.temp_f);
				});
			});
	};

});

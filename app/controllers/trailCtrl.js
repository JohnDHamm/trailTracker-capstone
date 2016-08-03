"use strict";

app.controller("trailCtrl", function($scope, $routeParams, DatabaseFactory, WeatherFactory, uiGmapGoogleMapApi, AuthFactory, $location){

	//check if logged in to display option for adding new post
	$scope.loggedIn = AuthFactory.isAuthenticated();

	// get all trails then filter to just the trail with the path Id
	$scope.trailList = [];
	$scope.weather = {};
	let selectedTrailId = "";
	let selectedTrail = {};
	// let showPostForm = false;
	let newPost = {};

	

	let loadTrailPage = function(){
		DatabaseFactory.getTrailList()
			.then(function(trails){
				$scope.trailList =  trails;
				//filter to get selected trail
			 	$scope.selectedTrail = $scope.trailList.filter(function(trail){
			 		return trail.trailId === $routeParams.trailId;
			 	})[0];

			 	//define map parameters
			 	let mapType = "TERRAIN";
			 	$scope.map = { 
			 		center: { latitude: $scope.selectedTrail.latitude, longitude: $scope.selectedTrail.longitude },
			 		zoom: $scope.selectedTrail.mapZoom
			 	};
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
	};



	$scope.postRideReport = function(){
		let typeString = "ride-report";
		let timeStamp = Date.now();
		newPost = {
			description: $scope.description,
			postType: 1,
			postTypeString: typeString,
			userId: AuthFactory.getUserId(),
			userName: AuthFactory.getCurrentUser().userName,
			postDate: timeStamp,
			ticketOpen: false,
			postTrailId: $scope.selectedTrail.trailId
		};
		DatabaseFactory.addPost(newPost)
			.then(function(){
				//reload page/posts
				loadTrailPage();
			});
	};
	
	loadTrailPage();

});

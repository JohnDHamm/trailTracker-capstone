"use strict";

app.controller("trailCtrl", function($scope, $routeParams, DatabaseFactory, WeatherFactory, uiGmapGoogleMapApi, AuthFactory, $location){

	//check if logged in to display option for adding new post
	$scope.loggedIn = AuthFactory.isAuthenticated();

	// get all trails then filter to just the trail with the path Id
	$scope.trailList = [];
	$scope.weather = {};
	$scope.posts = [];
	let selectedTrailId = "";
	let selectedTrail = {};
	// let showPostForm = false;
	let newPost = {};
	let newClosedPost = {};

	

	let loadTrailPage = function(){
		DatabaseFactory.getTrailList()
			.then(function(trails){
				$scope.trailList =  trails;
				//filter to get selected trail
			 	$scope.selectedTrail = $scope.trailList.filter(function(trail){
			 		return trail.trailId === $routeParams.trailId;
			 	})[0];

			 	//define map parameters
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
					//sort posts by most recent first
					let key = "postDate";
					let sortedPosts = sortByKey(posts, key);
					$scope.posts = sortedPosts;
					// ********* GET GOOGLE MAP *********
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
				$scope.description = "";
				loadTrailPage();
			});
	};

	$scope.postOpenTicket = function(){
		let typeString = "open-ticket";
		let timeStamp = Date.now();
		newPost = {
			description: $scope.description,
			postType: 2,
			postTypeString: typeString,
			userId: AuthFactory.getUserId(),
			userName: AuthFactory.getCurrentUser().userName,
			postDate: timeStamp,
			ticketOpen: true,
			postTrailId: $scope.selectedTrail.trailId
		};
		DatabaseFactory.addPost(newPost)
			.then(function(){
				//reload page/posts
				$scope.description = "";
				loadTrailPage();
			});
	};

	$scope.postMeetup = function(){
		let typeString = "meetup";
		let timeStamp = Date.now();
		newPost = {
			description: $scope.description,
			postType: 3,
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
				$scope.description = "";
				loadTrailPage();
			});
	};

	$scope.closeTicket = function (origPostId) {
		let timeStamp = Date.now();
		let typeString = "closed-ticket";
		let origPost = {};

		//get original post for description, user, date
		$scope.posts.forEach(function(post){
			if (post.postId === origPostId) {
				origPost = post;
			}
		});

		let fixerUserName = AuthFactory.getCurrentUser().userName;

		let newDescription = $scope.description;

		let closedDescription = `original issue: "${origPost.description}"" by ${origPost.userName} on ${origPost.postDate} has been closed by ${fixerUserName} - "${newDescription}" - Beers for all!`;

		newClosedPost = {
			description: closedDescription,
			postType: 4,
			postTypeString: typeString,
			userId: AuthFactory.getUserId(),
			userName: AuthFactory.getCurrentUser().userName,
			postDate: timeStamp,
			ticketOpen: false,
			postTrailId: $scope.selectedTrail.trailId
		};

		DatabaseFactory.resolveOpenTicket(newClosedPost, origPostId)
			.then(function(){
				//reload page/posts
				$scope.description = "";
				loadTrailPage();
			});
	};


	function sortByKey(posts, key) {
		return posts.sort(function(a, b) {
			var x = a[key];
			var y = b[key];
			return ((y < x) ? -1 : ((y > x) ? 1 : 0));
		});
	}
	
	loadTrailPage();

});

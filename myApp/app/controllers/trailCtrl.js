"use strict";

app.controller("trailCtrl", function($q, $scope, $routeParams, DatabaseFactory, WeatherFactory, uiGmapGoogleMapApi, AuthFactory, $location, Upload, StorageFactory, $rootScope, ExifFactory){

	//check if logged in to display option for adding new post
	$scope.loggedIn = AuthFactory.isAuthenticated();

	$scope.trailList = [];
	$scope.weather = {};
	$scope.posts = [];
	let selectedTrailId = "";
	let selectedTrail = {};
	let newPost = {};
	let newClosedPost = {};
	let origPost = {};
	$scope.description = "";

	$scope.selectPhotoUrl = null;

	$scope.showCloseTicketModal = false;
	$scope.showOpenTicketModal = false;
	$rootScope.photoUploadDone = false;
	$scope.$watch($rootScope.photoUploadDone);
	$scope.showLargePhoto = false;
	$scope.photoLoading = false;
	let geoTagCoords = {};

	$scope.showPostErrMsg = false;

	// get all trails then filter to just the trail with the path Id
	let loadTrailPage = function(){
		DatabaseFactory.getTrailList()
			.then(function(trails){
				$scope.trailList =  trails;
				//filter to get selected trail
			 	$scope.selectedTrail = $scope.trailList.filter(function(trail){
			 		return trail.trailId === $routeParams.trailId;
			 	})[0];
			 	console.log("selected trail: ", $scope.selectedTrail);
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
				.then(function(postsFromFB){
					//sort posts by most recent first
					let key = "postDate";
					let sortedPosts = sortByKey(postsFromFB, key);
					$scope.posts = sortedPosts;

					//go through posts and push any geoTag coords to an array for map markers
					let markers = [];
					let idKey = "id";
					let title = "title";
					let show = "show";
					$scope.posts.forEach(function(post) {
						if (post.photoGeoTag) {
							let newMarker = post.photoGeoTag;
							newMarker[title] = post.description;
							newMarker[idKey] = post.postId;
							newMarker[show] = false;
							markers.push(newMarker);
						}
					});
					$scope.openMarkers = markers;
					$scope.onClick = function(marker, eventName, model) {
            model.show = !model.show;
          };

					// ********* GET GOOGLE MAP *********
			    // uiGmapGoogleMapApi is a promise.
			    // The "then" callback function provides the google.maps object.

			    //get map markers from posts + add to map object

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
		if ($scope.description === "") {
			$scope.showPostErrMsg = true;
			return;
		}
		$scope.showPostErrMsg = false;

		let typeString = "ride-report";
		let timeStamp = new Date();
		newPost = {
			description: $scope.description,
			postType: 1,
			postTypeString: typeString,
			userId: AuthFactory.getUserId(),
			userName: AuthFactory.getCurrentUser().userName,
			postDate: timeStamp,
			postFormatDate: formatDate(timeStamp),
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


	$scope.postMeetup = function(){
		if ($scope.description === "") {
			$scope.showPostErrMsg = true;
			return;
		}
		$scope.showPostErrMsg = false;

		let typeString = "meetup";
		let timeStamp = new Date();
		newPost = {
			description: $scope.description,
			postType: 3,
			postTypeString: typeString,
			userId: AuthFactory.getUserId(),
			userName: AuthFactory.getCurrentUser().userName,
			postDate: timeStamp,
			postFormatDate: formatDate(timeStamp),
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


	$scope.closeTicketModal = function(origPostId){
		$scope.showCloseTicketModal = true;

		//get original post for description, user, date
		$scope.posts.forEach(function(post){
			if (post.postId === origPostId) {
				origPost = post;
			}
		});
	};

	//cancel button - close modal
	$scope.cancelCloseTicket = function() {
		$scope.showCloseTicketModal = false;
	};

	$scope.closeTicket = function () {
		$scope.showCloseTicketModal = false;

		let timeStamp = new Date();
		let typeString = "closed-ticket";

		let fixerUserName = AuthFactory.getCurrentUser().userName;

		let newDescription = $scope.closeDescription;

		let closedTicketDescription = `original issue: "${origPost.description}"" by ${origPost.userName} on ${origPost.postFormatDate} has been closed by ${fixerUserName} - "${newDescription}" - Beers for all!`;

		newClosedPost = {
			description: closedTicketDescription,
			postType: 4,
			postTypeString: typeString,
			userId: AuthFactory.getUserId(),
			userName: AuthFactory.getCurrentUser().userName,
			postDate: timeStamp,
			postFormatDate: formatDate(timeStamp),
			ticketOpen: false,
			postTrailId: $scope.selectedTrail.trailId
		};

		DatabaseFactory.resolveOpenTicket(newClosedPost, origPost.postId)
			.then(function(){
				//reload page/posts
				$scope.description = "";
				$scope.closeDescription = "";
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

	let formatDate = function(newDate) {
    // Create a date object with the current time
      var now = newDate;
    // Create an array with the current month, day and time
      var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
    // Create an array with the current hour, minute and second
      var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    // Determine AM or PM suffix based on the hour
      var suffix = ( time[0] < 12 ) ? "AM" : "PM";
    // Convert hour from military time
      time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    // If hour is 0, set it to 12
      time[0] = time[0] || 12;
    // If seconds and minutes are less than 10, add a zero
      for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
          time[i] = "0" + time[i];
        }
      }
    // Return the formatted string
      return date.join("/") + " " + time.join(":") + " " + suffix;
   };

  $scope.openTicketModal = function(){
  	if ($scope.description === "") {
			$scope.showPostErrMsg = true;
			return;
		}
		$scope.showPostErrMsg = false;
		$scope.showOpenTicketModal = true;
	};


  $scope.uploadOpenTicketImg = function(file){
  	$scope.photoLoading = true;
  	//get exif data and set to vars for map markers

		StorageFactory.uploadTask(file, StorageFactory.setMetadata());
  	let newTicketCoords = getGeoTagData(file);

		// $scope.postOpenTicket();
		//check to see if upload done + have url

	};


	$scope.postOpenTicket = function(){
		//make map marker with geoData
		$scope.photoLoading = false;
		$scope.uploadedImg = "";
		$rootScope.photoUploadDone = false;
		$scope.showOpenTicketModal = false;
		let typeString = "open-ticket";
		let timeStamp = new Date();
		newPost = {
			description: $scope.description,
			postType: 2,
			postTypeString: typeString,
			userId: AuthFactory.getUserId(),
			userName: AuthFactory.getCurrentUser().userName,
			postDate: timeStamp,
			postFormatDate: formatDate(timeStamp),
			ticketOpen: true,
			hasPhoto: true,
			postTrailId: $scope.selectedTrail.trailId,
			imageUrl: StorageFactory.getImageUrl(),
			photoGeoTag: geoTagCoords
		};
		$scope.selectedTrail.numOpenTickets = $scope.selectedTrail.numOpenTickets + 1;
		DatabaseFactory.updateTrailTicketCount($scope.selectedTrail)
			.then(() => DatabaseFactory.addPost(newPost))
			.then(function(){
				//reload page/posts
				$scope.description = "";
				loadTrailPage();
			});
	};

	$scope.postOpenTicketNoPhoto = function(){
		$scope.photoLoading = false;
		$scope.uploadedImg = "";
		$rootScope.photoUploadDone = false;
		$scope.showOpenTicketModal = false;
		let typeString = "open-ticket";
		let timeStamp = new Date();
		newPost = {
			description: $scope.description,
			postType: 2,
			postTypeString: typeString,
			userId: AuthFactory.getUserId(),
			userName: AuthFactory.getCurrentUser().userName,
			postDate: timeStamp,
			postFormatDate: formatDate(timeStamp),
			ticketOpen: true,
			hasPhoto: false,
			postTrailId: $scope.selectedTrail.trailId,
			imageUrl: null
		};
		$scope.selectedTrail.numOpenTickets = $scope.selectedTrail.numOpenTickets + 1;
		console.log("+1 open tickets: ", $scope.selectedTrail.numOpenTickets);

		DatabaseFactory.updateTrailTicketCount($scope.selectedTrail)
			.then(() => DatabaseFactory.addPost(newPost))
			.then(function(){
				//reload page/posts
				$scope.description = "";
				loadTrailPage();
			});
	};

	// show full photo from selected thumbanil in post


	$scope.showPhoto = function(url){
		$scope.showLargePhoto = true;
		$scope.selectPhotoUrl = url;
	};

	$scope.closePhoto = function(){
		$scope.showLargePhoto = false;
	};


	let getGeoTagData = function(uploadedImg){
    ExifFactory.EXIFgetData(uploadedImg, function() {
      var latitude = ExifFactory.EXIFgetTag(uploadedImg, "GPSLatitude"),
          longitude = ExifFactory.EXIFgetTag(uploadedImg, "GPSLongitude"),
          longRef = ExifFactory.EXIFgetTag(uploadedImg, "GPSLongitudeRef");
      // convert to degrees only
      let convLat = convertCoord(latitude),
      	convLong = convertCoord(longitude);

      //check if longRef = West, change to negative value
      if (longRef === "W") {
      	convLong = convLong * -1;
      }

      geoTagCoords = {"latitude": convLat,
      	"longitude": convLong};
      return geoTagCoords;

    });
	};

	// converts coordinates from deg/min/sec to degrees
	let convertCoord = function(coord){
		let coordSec = coord[2].numerator/coord[2].denominator;
		let coordMin = (coord[1].numerator/coord[1].denominator)+(coordSec/60);
		let coordDeg = (coord[0].numerator/coord[0].denominator)+(coordMin/60);
		return coordDeg;
	};



	loadTrailPage();

});

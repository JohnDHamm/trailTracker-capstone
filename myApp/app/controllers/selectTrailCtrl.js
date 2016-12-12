"use strict";

app.controller("selectTrailCtrl", function($scope, DatabaseFactory){

	let trailList = [];

	DatabaseFactory.getTrailList()
		.then(function(trails){
			console.log("trails", trails);
			console.log("HC", trails[0].trailName);
			trails.forEach(function () {
				console.log("trailName", trails.trailName);
			})
			for (let i = 0; i < trails.length; i++) {
				console.log("trails", i, trails[i].numOpenTickets);
				if (trails[i].numOpenTickets !== 0) {
					trails[i].showBadge = true;
					console.log("showBadge", i, trails[i].showBadge);
				}
 			}
			$scope.trailList = trails;
		});



});

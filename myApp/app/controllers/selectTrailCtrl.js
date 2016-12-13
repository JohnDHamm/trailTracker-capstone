"use strict";

app.controller("selectTrailCtrl", function($scope, DatabaseFactory){

	let trailList = [];

	DatabaseFactory.getTrailList()
		.then(function(trails){
			for (let i = 0; i < trails.length; i++) {
				if (trails[i].numOpenTickets !== 0) {
					trails[i].showBadge = true;
				}
 			}
			$scope.trailList = trails;
		});



});

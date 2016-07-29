"use strict";

app.controller("trailCtrl", function($scope, DatabaseFactory){
	
	console.log("switched to trail page");
	$scope.trailColor = "light-green darken-2"
	// let trailList = [];

	// DatabaseFactory.getTrailList()
	// 	.then(function(trails){
	// 		$scope.trailList =  trails;
	// 	});

});

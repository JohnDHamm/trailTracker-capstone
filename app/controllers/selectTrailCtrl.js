"use strict";

app.controller("selectTrailCtrl", function($scope, DatabaseFactory){
	
	console.log("switched to selectTrail");
	let trailList = [];

	DatabaseFactory.getTrailList()
		.then(function(trails){
			$scope.trailList =  trails;
		});




});
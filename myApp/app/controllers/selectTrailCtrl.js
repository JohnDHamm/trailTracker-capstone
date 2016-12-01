"use strict";

app.controller("selectTrailCtrl", function($scope, DatabaseFactory){
	
	let trailList = [];

	DatabaseFactory.getTrailList()
		.then(function(trails){
			$scope.trailList =  trails;
		});



});
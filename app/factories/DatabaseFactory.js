"use strict";

app.factory("DatabaseFactory", function($q, $http, FirebaseURL) {


	let getTrailList = function() {
		let trailList = [];
		return $q(function(resolve, reject) {
			$http.get(`${FirebaseURL}/trails.json`)
			.success(function(trailsObj) {
				console.log("trailsObj", trailsObj);
				//create array from object and loop thru keys to push each board to the boards array
				Object.keys(trailsObj).forEach(function(key){
					trailList.push(trailsObj[key]);
				});
				console.log("trailList:", trailList);
				resolve (trailList);
			})
			.error(function(error) {
				reject(error);
			});
		});
	};


	return {getTrailList};
});
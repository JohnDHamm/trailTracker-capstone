"use strict";

app.factory("WeatherFactory", function($q, $http) {

	function getCurrentWeather(lat, long){
		return new Promise(function(resolve, reject){
			$.ajax({
				url: `https://api.wunderground.com/api/f86d6fa04b4dd2cd/conditions/q/${lat},${long}.json`
			}).done(function(data){
				resolve(data);
			});
		});


	}



	return {getCurrentWeather};
	
});
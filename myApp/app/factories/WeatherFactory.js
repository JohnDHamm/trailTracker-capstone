"use strict";

app.factory("WeatherFactory", function($q, $http) {

	function getCurrentWeather(lat, long){
		return new Promise(function(resolve, reject){
			$.ajax({
				// url: `http://api.wunderground.com/api/f86d6fa04b4dd2cd/conditions/q/${lat},${long}.json`
				url: `https://trailweatherproxy.herokuapp.com/${lat},${long}`
			}).done(function(data){
				resolve(JSON.parse(data));
			});
		});
	}

	return {getCurrentWeather};

});

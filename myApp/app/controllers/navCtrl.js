"use strict";

app.controller("navCtrl", function($scope, AuthFactory, $location){

		$scope.logout = function(){
		AuthFactory.logout();
		$location.url("/login");
		// $scope.$apply();

	};

});
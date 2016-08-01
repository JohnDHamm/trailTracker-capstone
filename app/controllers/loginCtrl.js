"use strict";

app.controller("loginCtrl", function($scope){

	$scope.registerMode = true;

	$scope.activateRegisterMode = function(){
		$scope.registerMode = true;
	};

	$scope.activateLoginMode = function(){
		$scope.registerMode = false;
	};

});
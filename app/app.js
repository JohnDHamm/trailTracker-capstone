"use strict";

var app = angular.module("TrailApp", ["ngRoute"])
	.constant('FirebaseURL', "https://trailtracker-capstone.firebaseio.com/");

app.config(function($routeProvider, FBCreds) {

  let authConfig = {
    apiKey: FBCreds.apiKey,
    authDomain: FBCreds.authDomain
  };
  firebase.initializeApp(authConfig);

  $routeProvider.
   when('/login', {
     templateUrl: 'partials/login.html',
     controller: 'loginCtrl'
   })
   .when('/selectTrail', {
      templateUrl: 'partials/selectTrail.html',
      controller: 'selectTrailCtrl'
   })
   .when('/trail/:trailId', {
      templateUrl: 'partials/trail.html',
      controller: 'trailCtrl'
   });
});
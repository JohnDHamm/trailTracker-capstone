"use strict";

var app = angular.module("TrailApp", ["ngRoute", "uiGmapgoogle-maps"])
	.constant('FirebaseURL', "https://trailtracker-capstone.firebaseio.com/");

app.config(function($routeProvider, FBCreds, uiGmapGoogleMapApiProvider) {

  let authConfig = {
    apiKey: FBCreds.apiKey,
    authDomain: FBCreds.authDomain
  };
  firebase.initializeApp(authConfig);

  uiGmapGoogleMapApiProvider.configure({
		key: 'AIzaSyDkCVdTHzHjxjJ0XEzjKrWeyj0YZJLKfqo',
    v: '3', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });



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

"use strict";

var app = angular.module("TrailApp", ["ngRoute"]);

app.config(function($routeProvider) {

  $routeProvider.
   when('/login', {
     templateUrl: 'partials/login.html',
     controller: 'loginCtrl'
   })
   .when('/selectTrail', {
      templateUrl: 'partials/selectTrail.html',
      controller: 'selectTrailCtrl'
   })
   .when('/trail', {
      templateUrl: 'partials/trail.html',
      controller: 'trailCtrl'
   });
});
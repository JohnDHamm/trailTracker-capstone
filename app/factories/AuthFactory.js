"use strict";

app.factory("AuthFactory", function(){
	let currentUserId = null;
	let currentUser = {};
	let provider = new firebase.auth.GoogleAuthProvider();

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    // console.log("user logged in, dude", user.uid);
	    currentUserId = user.uid;
	    setCurrentUser(user);
	  } else {
	    // No user is signed in.
	    // console.log("user not logged in");
	    // currentUser = null;
	  }
	});

	let logout = function(){
		firebase.auth().signOut().then(function(){
			currentUserId = null;
			// console.log("logged out!", currentUserId);
		}, function(error){

		});
	};

	var authWithProvider = function(){
		return firebase.auth().signInWithPopup(provider);
	};

	let isAuthenticated = function(){
		return (currentUserId) ? true : false;
	};

	let setCurrentUser = function(newUser){
		currentUser = newUser;
		// console.log("setCurrentUser", currentUser);
	};

	let getCurrentUser = function(){
		return currentUser;
	};

	let getUserId = function(){
		return currentUserId;
	};

	return {authWithProvider, isAuthenticated, getUserId, logout, setCurrentUser, getCurrentUser};

});

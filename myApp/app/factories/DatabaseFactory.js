"use strict";

app.factory("DatabaseFactory", function($q, $http, FirebaseURL) {


	let getTrailList = function() {
		let trailList = [];
		return $q(function(resolve, reject) {
			$http.get(`${FirebaseURL}/trails.json`)
			.success(function(trailsObj) {
				//create array from object and loop thru keys to push each board to the boards array
				Object.keys(trailsObj).forEach(function(key){
					trailList.push(trailsObj[key]);
				});
				resolve (trailList);
			})
			.error(function(error) {
				reject(error);
			});
		});
	};

	// get all posts with associated trailId
	let getTrailPosts = function(trailId){
		let postsArray = [];
		return $q(function(resolve, reject) {
			$http.get(`${FirebaseURL}/posts.json?orderBy="postTrailId"&equalTo="${trailId}"`)
			.success(function(postsObj) {
				//create array from object and loop thru keys to push each board to the posts array
				Object.keys(postsObj).forEach(function(key){
					postsArray.push(postsObj[key]);
				});
				resolve (postsArray);
			})
			.error(function(error) {
				reject(error);
			});
		});
	};

	//get all users
	let getUsers = function(){
		let usersList = [];
		return $q(function(resolve, reject){
			$http.get(`${FirebaseURL}/users.json`)
			.success(function(usersObj){
				//add each user to the usersList array
				Object.keys(usersObj).forEach(function(key){
					usersList.push(usersObj[key]);
				});
				resolve (usersList);
			})
			.error(function(error){
				reject(error);
			});
		});
	};

	//add user to database
	let addUser = function(newUser){
		return $q(function(resolve, reject){
			$http.post(`${FirebaseURL}/users.json`,
				JSON.stringify(newUser))
			.success(function(ObjFromFirebase){
				resolve(ObjFromFirebase);
			})
			.error(function(error){
				reject(error);
			});
		});
	};

	let addPost = function(newPost){
		return $q(function(resolve, reject){
			$http.post(`${FirebaseURL}/posts.json`,
				JSON.stringify(newPost))
			.success(function(ObjFromFirebase){
				//need to add fb postId to item and update
				let newPostId = ObjFromFirebase.name;
				newPost.postId = newPostId;
				$http.put(`${FirebaseURL}/posts/${newPostId}.json`, newPost);
				resolve(ObjFromFirebase);
			})
			.error(function(error){
				reject(error);
			});
		});
	};

	let resolveOpenTicket = function(newClosedPost, origPostId) {
		return $q(function(resolve, reject){
			// post new closed ticket
			$http.post(`${FirebaseURL}/posts.json`,
				JSON.stringify(newClosedPost))
			.success(function(ObjFromFirebase){
				//need to add fb postId to item and update
				let newPostId = ObjFromFirebase.name;
				newClosedPost.postId = newPostId;
				$http.put(`${FirebaseURL}/posts/${newPostId}.json`, newClosedPost);
				resolve(ObjFromFirebase);
			})
			.error(function(error){
				reject(error);
			});
			//delete orig open ticket
			$http.delete(`${FirebaseURL}/posts/${origPostId}.json`)
					.success(function(){
						resolve();
					});
		});
	};

	let updateTrailTicketCount = function (updatedTrailObj) {
		return $q(function(resolve, reject){
			$http.put(`${FirebaseURL}/trails/${updatedTrailObj.trailId}.json`, updatedTrailObj)
			.success(function(Obj){
				resolve(Obj);
			})
			.error(function(error){
				reject(error);
			});
		});

	}



	return {getTrailList, getTrailPosts, getUsers, addUser, addPost, resolveOpenTicket, updateTrailTicketCount};

});

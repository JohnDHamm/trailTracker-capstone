"use strict";

app.factory("StorageFactory", function($q, $http, FirebaseURL) {

	let imageUrl = "";
    
  // Create a root reference
  var storageRef = firebase.storage().ref();

  // Image Ref
  var imagesRef = storageRef.child('img');

  // Create the file metadata
  let getMetadata = function() {
      let metadata = {
        contentType: 'image/jpg'
        // "uid": currentUser.uid
      };
      return metadata;
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  let uploadTask = function(file, metadata) {
    storageRef.child('img/' + file.name).put(file, metadata)
    .on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      console.log("snapshot", snapshot);
      // See below for more detail
      }, function(error) {
      // Handle unsuccessful uploads
      }, function() {
        // console.log(file.name);
        let imgRef = storageRef.child('img/' + file.name);
        imgRef.getDownloadURL()
          .then(function(url) {
            imageUrl = url;
            console.log("upload done - image url:", imageUrl);
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          });
      });
  };

  let fetchDownloadLink = function (file) {
    let fileName = file.val().name;
    console.log("fecth", file);
    let imgRef = storageRef.child('img/' + fileName);
    imgRef.getDownloadURL().then(function(url) {
        console.log(url);
    });
  };

  let getImageUrl = function () {
    return imageUrl;
  };

  return {uploadTask, getMetadata, fetchDownloadLink, getImageUrl};

});
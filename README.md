# Trail Tracker

My NSS front-end capstone project, Trail Tracker is an app for the mountain bike community. Users can check trail conditions, organize future rides, or open a ticket about an issue and upload a geotagged photo that displays on a map to let volunteers who maintain the trail know the exact location.

##### _Technologies:_
* AngularJS
* Firebase (database, image storage and app deployment)
* Materialize
* Sass
* Angular-Google-Maps
* WeatherUnderground API

Deployed version for demonstration:  https://trailtracker-capstone.firebaseapp.com

###### _Features recently added:_
1. The number of currently open tickets for each trail is displayed on the trail selection page.

###### _Known issues:_
1. When opening a ticket, if the user chooses to upload a photo but selects the "Upload photo" button without selecting a file first, app may become frozen.

###### _Features to be implemented soon:_
1. Profile page for users to upload an avatar photo and choose a "home" trail.
2. On trail selection page, the user's "home" trail will be displayed at the top, with all other trails ordered by proximity.
3. Weather display for selected trail: options for viewing past rain data and future forecast.
4. Ability to filter posts by post type (ride report, open/closed tickets, meetup).

###### _Proxy NodeJS Server_
A separate NodeJS proxy server app was created for handling the unsecure API calls to WeatherUnderground (Firebase will not allow unsecure http requests from hosted apps). The app is deployed on Heroku and the repo is located here:
https://github.com/JohnDHamm/trail_tracker-proxy

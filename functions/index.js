'use strict';

const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./push-web-app-52e8d-firebase-adminsdk-3wttu-38b026cfea.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://push-web-app-52e8d.firebaseio.com"
});

/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 * /notifications/{notificationId}
 */
const getDeviceTokensPromise = admin.database().ref(`/currentToken`).once('value');
  return getDeviceTokensPromise.then((data)=>{
    if(!data.val()){
      console.log("data don't exist")
    } 

    const snapshot = data.val();
    // console.log(snapshot);
    const tokens = [];

    for (let key in snapshot){
      tokens.push(snapshot[key].currentToken); 
    }

    // console.log("this is TOKEN: " + tokens);
    const SNAPSHOT = change.after.val();
    const msg = {
        notification: {
          title: SNAPSHOT.user,
          body: SNAPSHOT.message,
          icon: SNAPSHOT.userProfileImg
        }
      };
    console.log(msg);

    admin.messaging().sendToDevice(tokens, msg)
    .then(function(response){
      console.log("success!",response);
    })
    .catch(function(error){
      console.log("fail to send :( ",error);
    })
});
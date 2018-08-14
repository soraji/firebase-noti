const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotifications = functions.database.ref('/notifications/{notificationId}').onWrite((change, context) => {

  // Exit if data already created
  if (change.before.val()) {
    return null;
  }

  // Exit when the data is deleted
  if (!change.before.exists()) {
    return null;
  }

  // Setup notification
  const NOTIFICATION_SNAPSHOT = DataSnapshot;
  const payload = {
    notification: {
      title: `New Message from ${NOTIFICATION_SNAPSHOT.val().user}!`,
      body: NOTIFICATION_SNAPSHOT.val().message,
      icon: NOTIFICATION_SNAPSHOT.val().userProfileImg,
      click_action: `https://${process.env.FIREBASE_CONFIG.authDomain}`
    }
  }
  console.log(payload);



});
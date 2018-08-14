{

/* ========================
  Variables
======================== */

const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();
const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const subscribeButton = document.getElementById('subscribe');
const unsubscribeButton = document.getElementById('unsubscribe');
const sendNotificationForm = document.getElementById('send-notification-form');

/* ========================
  Event Listeners
======================== */
signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOut);
subscribeButton.addEventListener("click", subscribeToNotifications);
unsubscribeButton.addEventListener("click", unsubscribeFromNotifications);
FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);
FIREBASE_MESSAGING.onTokenRefresh(handleTokenRefresh);
sendNotificationForm.addEventListener("submit", sendNotification);


/* ========================
  Functions
======================== */
function signIn() {
  FIREBASE_AUTH.signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

function signOut(){
	FIREBASE_AUTH.signOut();
}

function handleAuthStateChanged(user){
	if(user){
		console.log(user);
		signInButton.setAttribute("hidden","true");
		signOutButton.removeAttribute("hidden");
		checkSubscription();
	}else{
		console.log("no user");
		signOutButton.setAttribute("hidden","true");
		signInButton.removeAttribute("hidden");
	}
}
function subscribeToNotifications() {
  FIREBASE_MESSAGING.requestPermission()
	.then(function() {
	  console.log('Notification permission granted.');
	  return FIREBASE_MESSAGING.getToken();
	})
	.then(function(currentToken){
        console.log(currentToken);

        FIREBASE_DATABASE.ref('currentToken').push({
        	currentToken : currentToken,
        	uid: FIREBASE_AUTH.currentUser.uid
        });
	})
	.then(() => checkSubscription())
	.catch(function(err) {
	  console.log('Unable to get permission to notify.', err);
	});
}

function handleTokenRefresh() {
  return FIREBASE_MESSAGING.getToken()
  .then(function(currentToken){
    FIREBASE_DATABASE.ref('currentToken').push({
      currentToken: currentToken,
      uid: FIREBASE_AUTH.currentUser.uid
    });
  });
}

function unsubscribeFromNotifications() {
  FIREBASE_MESSAGING.getToken()
    .then((token) => {
    		console.log(token)
    		FIREBASE_MESSAGING.deleteToken(token)
    })
    .then(() => FIREBASE_DATABASE.ref('currentToken').orderByChild("uid").equalTo(FIREBASE_AUTH.currentUser.uid).once('value'))
    .then((snapshot) => {
    	console.log(snapshot.val());
      const key = Object.keys(snapshot.val())[0];
      return FIREBASE_DATABASE.ref('currentToken').child(key).remove();
    })
    .then(() => checkSubscription())
    .catch((err) => {
      console.log("error deleting token :(");
    });
}

function checkSubscription() {
  FIREBASE_DATABASE.ref('tokens').orderByChild("uid").equalTo(FIREBASE_AUTH.currentUser.uid).once('value').then((snapshot) => {
    if ( snapshot.val() ) {
      subscribeButton.setAttribute("hidden", "true");
      unsubscribeButton.removeAttribute("hidden");
      console.log('you are now subscribed')
    } else {
      unsubscribeButton.setAttribute("hidden", "true");
      subscribeButton.removeAttribute("hidden");
      console.log('you are now not subscribed')
    }
  });
}

function sendNotification(e) {
  e.preventDefault();

  const notificationMessage = document.getElementById('notification-message').value;
  if ( !notificationMessage ) return;

  FIREBASE_DATABASE.ref('/notifications')
    .push({
      user: FIREBASE_AUTH.currentUser.displayName,
      message: notificationMessage,
      userProfileImg: FIREBASE_AUTH.currentUser.photoURL
    })
    .then(() => {
      document.getElementById('notification-message').value = "";
    })
    .catch(() => {
      console.log("error sending notification :(")
    });
}


}
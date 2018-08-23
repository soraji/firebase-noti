importScripts('/__/firebase/3.8.0/firebase-app.js');
importScripts('/__/firebase/3.8.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

firebase.initializeApp({
  'messagingSenderId': '696758097282'
});

const messaging = firebase.messaging();
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: 'AIzaSyC3mVtgMlSDm3PWqaI4hA-ChW24qku9iDo',
  authDomain: 'push-notification-145fd.firebaseapp.com',
  projectId: 'push-notification-145fd',
  messagingSenderId: '819254524202',
  appId: '1:819254524202:web:c61d7791363e4a4a650653',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const title = payload.notification?.title || "Thông báo";
  const options = {
    body: payload.notification?.body || "",
    icon: "/favi.png",
  };

  self.registration.showNotification(title, options);
});
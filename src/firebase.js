import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDFune4-F1_Xqy5qklHdil12SF-92qCy_g",
    authDomain: "eventsapp-45c2f.firebaseapp.com",
    projectId: "eventsapp-45c2f",
    storageBucket: "eventsapp-45c2f.appspot.com",
    messagingSenderId: "58641160739",
    appId: "1:58641160739:web:17160f68e2010ffff9ef96",
    measurementId: "G-Y1LVGSF8VN"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
// Firebase config information
const firebaseConfig = {
  apiKey: "AIzaSyDwuru35xP0eibbVWge0mxdE2wgenaoeG4",
  authDomain: "trckr-login.firebaseapp.com",
  projectId: "trckr-login",
  storageBucket: "trckr-login.appspot.com",
  messagingSenderId: "351673525070",
  appId: "1:351673525070:web:ef1e73542d0c3ad7d6f41f",
  measurementId: "G-X1TPJG9R8B"
};

// Starts firebase
firebase.initializeApp(firebaseConfig);

// Declares firebase variables to use
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

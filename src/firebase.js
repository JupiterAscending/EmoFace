import firebase from "firebase/app";
import "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
});

const firestore = app.firestore();
firestore.settings({ timestampsInSnapshots: true });

export const database = {
  test: firestore.collection("test"),
  rooms: firestore.collection("rooms"),
};

// db.settings({ experimentalForceLongPolling: true });
export default app;

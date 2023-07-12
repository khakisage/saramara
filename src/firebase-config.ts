import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apikey: import.meta.env.VITE_APP_APIKEY,
//   authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
//   projectId: import.meta.env.VITE_APP_PROJECTID,
//   storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
//   messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
//   appId: import.meta.env.VITE_APP_APPID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyB-y2kC-gE6gCQKyArOHdPkmSRT6UonLIg",
  authDomain: "saramara-c629e.firebaseapp.com",
  projectId: "saramara-c629e",
  storageBucket: "saramara-c629e.appspot.com",
  messagingSenderId: "609347642729",
  appId: "1:609347642729:web:816d406769a0eddcebc9f8",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const db = firebase.firestore();

export { auth };

import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apikey: import.meta.env.REACT_APP_APIKEY,
  authDomain: import.meta.env.REACT_APP_AUTHDOMAIN,
  projectId: import.meta.env.REACT_APP_PROJECTID,
  storageBucket: import.meta.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: import.meta.env.REACT_APP_MESSAGINGSENDERID,
  appId: import.meta.env.REACT_APP_APPID,
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
export { firestore };

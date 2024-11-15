import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuY3nxhDkJOCb4tGemDCxsiWYEq6YB-PU",
  authDomain: "cloudtalk-68848.firebaseapp.com",
  projectId: "cloudtalk-68848",
  storageBucket: "cloudtalk-68848.appspot.com",
  messagingSenderId: "62317127691",
  appId: "1:62317127691:web:d673092f109b0a8f7fff0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
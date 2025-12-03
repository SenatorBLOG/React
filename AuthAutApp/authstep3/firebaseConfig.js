// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these with your actual Firebase config from the Firebase Console
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY", // <--- REPLACE THIS
//   authDomain: "YOUR_AUTH_DOMAIN", // <--- REPLACE THIS
//   projectId: "YOUR_PROJECT_ID", // <--- REPLACE THIS
//   storageBucket: "YOUR_STORAGE_BUCKET", // <--- REPLACE THIS
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // <--- REPLACE THIS
//   appId: "YOUR_APP_ID" // <--- REPLACE THIS
// };

const firebaseConfig = {
  apiKey: "AIzaSyCfDk-lIlhwwblPwfZpGUYtcFVGKv5l2EM",
  authDomain: "rnauthenticate-d6ede.firebaseapp.com",
  projectId: "rnauthenticate-d6ede",
  storageBucket: "rnauthenticate-d6ede.firebasestorage.app",
  messagingSenderId: "544451457404",
  appId: "1:544451457404:web:56e86c5f4ba428afcbb4f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
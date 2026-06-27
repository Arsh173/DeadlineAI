import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0Vn6HOXj-qCDssPkzJ4WuhtzRprOwyJs",
  authDomain: "meta-tempo-8pwwt.firebaseapp.com",
  projectId: "meta-tempo-8pwwt",
  storageBucket: "meta-tempo-8pwwt.firebasestorage.app",
  messagingSenderId: "351587915128",
  appId: "1:351587915128:web:f41a49271707073e62248d"
};

const app = initializeApp(firebaseConfig);

// Specify the custom database ID provided in the Firebase configuration
export const db = getFirestore(app, "ai-studio-56fa803a-530d-48bb-944e-38937494830b");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

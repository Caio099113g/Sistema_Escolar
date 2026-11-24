import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const firebaseConfig = {

  apiKey: "AIzaSyCjEsuaztNU0lAxJ-bybbFocJsvnToInTI",

  authDomain: "sistema-escolar-d58f0.firebaseapp.com",

  projectId: "sistema-escolar-d58f0",

  storageBucket: "sistema-escolar-d58f0.firebasestorage.app",

  messagingSenderId: "979039309779",

  appId: "1:979039309779:web:ced158ff4ac21e89606926"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export { auth, db };
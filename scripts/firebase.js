// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBOGaYJUxilYCekjvzd4kmQLIFpEF9ibgU",
    authDomain: "vitofitness-f6879.firebaseapp.com",
    projectId: "vitofitness-f6879",
    storageBucket: "vitofitness-f6879.appspot.com",
    messagingSenderId: "767780104447",
    appId: "1:767780104447:web:9dcc5fae6f92ede48d84ca",
    measurementId: "G-4VSWMZ3CVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

function getParam(paramName) {
    const paramValue = location.search.split(paramName + '=')[1];
    return paramValue === undefined ? null : decodeURIComponent(paramValue);
}


export async function getAgilityData() {
    const userId = getParam('userId');
    const querySnapshot = await getDocs(collection(db, "Users", userId, "Agility"));
    var resp;
    await querySnapshot.forEach((doc) => {
        resp = {
            id: doc.id,
            ...doc.data()
        }
    });
    return resp;
}



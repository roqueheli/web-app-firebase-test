import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBN-bjo4FTqQr1Iwb-x_cM2aBboqL7eVYE",
    authDomain: "proyecto-prueba-f56cf.firebaseapp.com",
    projectId: "proyecto-prueba-f56cf",
    storageBucket: "proyecto-prueba-f56cf.appspot.com",
    messagingSenderId: "250094618852",
    appId: "1:250094618852:web:03f989ad0785ed6f8004f1",
    measurementId: "G-JRW1P61HBN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Exporta la funcionalidad de la DB
export const firestore = firebase.firestore();
// exporta el paquete de firebase para poder usarlo
export default firebase;
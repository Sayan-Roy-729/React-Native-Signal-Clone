import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyCU6Rpq9vg0zG9r210G5jZF352xk-l0KMY',
    authDomain: 'fantacy11-hackathon.firebaseapp.com',
    projectId: 'fantacy11-hackathon',
    storageBucket: 'fantacy11-hackathon.appspot.com',
    messagingSenderId: '165461773463',
    appId: '1:165461773463:web:cb8bc17a02029790b3edd2',
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };


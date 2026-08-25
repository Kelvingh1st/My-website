// =====================================================
// GENTLEZ CLOTHING
// FIREBASE CONFIGURATION
// =====================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// =====================================================
// FIREBASE PROJECT CONFIG
// =====================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyDTov1l_c8Dw85OOC2rgqZNTdAqZFCtSVk",

    authDomain:
        "my-website-bdbb6.firebaseapp.com",

    databaseURL:
        "https://my-website-bdbb6-default-rtdb.firebaseio.com",

    projectId:
        "my-website-bdbb6",

    storageBucket:
        "my-website-bdbb6.firebasestorage.app",

    messagingSenderId:
        "370953417016",

    appId:
        "1:370953417016:web:38237b03ae8d08196151cd"

};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app =
    initializeApp(firebaseConfig);


// =====================================================
// FIREBASE AUTHENTICATION
// =====================================================

const auth =
    getAuth(app);


// =====================================================
// REALTIME DATABASE
// =====================================================

const database =
    getDatabase(app);


// =====================================================
// EXPORT
// =====================================================

export {
    app,
    auth,
    database
};

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function () {
    const userEmail = document.getElementById('user-email');
    const userStatus = document.getElementById('user-status');
    const logoutButton = document.getElementById('logout-button');

    auth.onAuthStateChanged(user => {
        if (user) {
            userEmail.textContent = user.email;
            userStatus.textContent = "Logged In";
        } else {
            window.location.href = "auth.html";
        }
    });

    logoutButton.addEventListener('click', function () {
        auth.signOut().then(() => {
            window.location.href = "auth.html";
        }).catch(error => {
            console.error('Logout error:', error);
        });
    });

    VanillaTilt.init(document.querySelectorAll('#logout-button'), {
        max: 25,
        speed: 400,
        glare: true,
        'max-glare': 0.4,
    });
});

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
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function () {
    const userEmail = document.getElementById('user-email');
    const userStatus = document.getElementById('user-status');
    const logoutButton = document.getElementById('logout-button');
    const challengeList = document.getElementById('challenge-list');

    auth.onAuthStateChanged(user => {
        if (user) {
            userEmail.textContent = user.email;
            userStatus.textContent = "Logged In";
            loadChallenges(user.uid);
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

    function loadChallenges(userId) {
        db.collection('challenges').doc(userId).get().then(doc => {
            if (doc.exists) {
                const challenges = doc.data().challenges;
                challenges.forEach((challenge, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${index + 1}. ${challenge.name}</span>
                        <input type="checkbox" ${challenge.completed ? 'checked' : ''} data-index="${index}">
                    `;
                    li.querySelector('input[type="checkbox"]').addEventListener('change', function () {
                        updateChallengeStatus(userId, index, this.checked);
                    });
                    challengeList.appendChild(li);
                });
            } else {
                console.log('No challenge data found');
            }
        }).catch(error => {
            console.error('Error fetching challenge data:', error);
        });
    }

    function updateChallengeStatus(userId, index, status) {
        db.collection('challenges').doc(userId).update({
            [`challenges.${index}.completed`]: status
        }).then(() => {
            console.log('Challenge status updated');
        }).catch(error => {
            console.error('Error updating challenge status:', error);
        });
    }

    VanillaTilt.init(document.querySelectorAll('#logout-button'), {
        max: 25,
        speed: 400,
        glare: true,
        'max-glare': 0.4,
    });
});

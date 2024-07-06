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
    const dailyStreak = document.getElementById('daily-streak');
    const weeklySummary = document.getElementById('weekly-summary');
    const logoutButton = document.getElementById('logout-button');
    const challengeList = document.getElementById('challenge-list');
    const badgeContainer = document.getElementById('badge-container');
    const preferencesForm = document.getElementById('preferences-form');

    auth.onAuthStateChanged(user => {
        if (user) {
            userEmail.textContent = user.email;
            userStatus.textContent = "Logged In";
            loadChallenges(user.uid);
            loadStreak(user.uid);
            loadWeeklySummary(user.uid);
            loadBadges(user.uid);
            loadPreferences(user.uid);
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
            if (status) {
                updateStreak(userId);
            }
        }).catch(error => {
            console.error('Error updating challenge status:', error);
        });
    }

    function loadStreak(userId) {
        db.collection('streaks').doc(userId).get().then(doc => {
            if (doc.exists) {
                const streakData = doc.data();
                dailyStreak.textContent = streakData.streak;
            } else {
                dailyStreak.textContent = '0';
            }
        }).catch(error => {
            console.error('Error fetching streak data:', error);
        });
    }

    function updateStreak(userId) {
        db.collection('streaks').doc(userId).get().then(doc => {
            if (doc.exists) {
                const streakData = doc.data();
                const lastCompleted = streakData.lastCompleted.toDate();
                const now = new Date();

                if (now.getDate() !== lastCompleted.getDate() || now.getMonth() !== lastCompleted.getMonth() || now.getFullYear() !== lastCompleted.getFullYear()) {
                    streakData.streak += 1;
                    streakData.lastCompleted = firebase.firestore.Timestamp.fromDate(now);
                }

                db.collection('streaks').doc(userId).set(streakData).then(() => {
                    dailyStreak.textContent = streakData.streak;
                    console.log('Streak updated');
                });
            } else {
                const now = new Date();
                const streakData = {
                    streak: 1,
                    lastCompleted: firebase.firestore.Timestamp.fromDate(now)
                };
                db.collection('streaks').doc(userId).set(streakData).then(() => {
                    dailyStreak.textContent = '1';
                    console.log('Streak started');
                });
            }
        }).catch(error => {
            console.error('Error updating streak:', error);
        });
    }

    function loadWeeklySummary(userId) {
        db.collection('summaries').doc(userId).get().then(doc => {
            if (doc.exists) {
                const summaryData = doc.data();
                weeklySummary.textContent = `Completed ${summaryData.completed} challenges this week`;
            } else {
                weeklySummary.textContent = 'No challenges completed this week';
            }
        }).catch(error => {
            console.error('Error fetching summary data:', error);
        });
    }

    function loadBadges(userId) {
        db.collection('badges').doc(userId).get().then(doc => {
            if (doc.exists) {
                const badges = doc.data().badges;
                badges.forEach(badge => {
                    const badgeElement = document.createElement('div');
                    badgeElement.classList.add('badge');
                    badgeElement.textContent = badge.name;
                    badgeContainer.appendChild(badgeElement);
                });
            } else {
                badgeContainer.textContent = 'No badges earned';
            }
        }).catch(error => {
            console.error('Error fetching badges:', error);
        });
    }

    preferencesForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const notification = preferencesForm.notification.checked;
        const darkMode = preferencesForm.dark-mode.checked;
        savePreferences(auth.currentUser.uid, { notification, darkMode });
    });

    function loadPreferences(userId) {
        db.collection('preferences').doc(userId).get().then(doc => {
            if (doc.exists) {
                const preferences = doc.data();
                preferencesForm.notification.checked = preferences.notification;
                preferencesForm.dark-mode.checked = preferences.darkMode;
            } else {
                console.log('No preferences data found');
            }
        }).catch(error => {
            console.error('Error fetching preferences data:', error);
        });
    }

    function savePreferences(userId, preferences) {
        db.collection('preferences').doc(userId).set(preferences).then(() => {
            console.log('Preferences saved');
        }).catch(error => {
            console.error('Error saving preferences:', error);
        });
    }

    VanillaTilt.init(document.querySelectorAll('#logout-button'), {
        max: 25,
        speed: 400,
        glare: true,
        'max-glare': 0.4,
    });
});

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
    const friendContainer = document.getElementById('friend-container');
    const addFriendForm = document.getElementById('add-friend-form');
    const sendMessageForm = document.getElementById('send-message-form');
    const messageContainer = document.getElementById('message-container');

    auth.onAuthStateChanged(user => {
        if (user) {
            userEmail.textContent = user.email;
            userStatus.textContent = "Logged In";
            loadChallenges(user.uid);
            loadStreak(user.uid);
            loadWeeklySummary(user.uid);
            loadBadges(user.uid);
            loadPreferences(user.uid);
            loadFriends(user.uid);
            loadMessages(user.uid);
        } else {
            window.location.href = 'auth.html';
        }
    });

    logoutButton.addEventListener('click', function () {
        auth.signOut().then(() => {
            window.location.href = 'auth.html';
        }).catch(error => {
            console.error('Error signing out:', error);
        });
    });

    addFriendForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const friendEmail = addFriendForm['friend-email'].value;
        addFriend(auth.currentUser.uid, friendEmail);
    });

    sendMessageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const messageText = sendMessageForm['message-text'].value;
        sendMessage(auth.currentUser.uid, messageText);
    });

    function loadFriends(userId) {
        db.collection('friends').doc(userId).collection('list').get().then(snapshot => {
            snapshot.forEach(doc => {
                const friend = doc.data();
                const friendElement = document.createElement('div');
                friendElement.classList.add('friend');
                friendElement.textContent = friend.email;
                friendContainer.appendChild(friendElement);
            });
        }).catch(error => {
            console.error('Error fetching friends:', error);
        });
    }

    function addFriend(userId, friendEmail) {
        db.collection('users').where('email', '==', friendEmail).get().then(snapshot => {
            if (!snapshot.empty) {
                const friendId = snapshot.docs[0].id;
                db.collection('friends').doc(userId).collection('list').doc(friendId).set({ email: friendEmail }).then(() => {
                    const friendElement = document.createElement('div');
                    friendElement.classList.add('friend');
                    friendElement.textContent = friendEmail;
                    friendContainer.appendChild(friendElement);
                    addFriendForm.reset();
                }).catch(error => {
                    console.error('Error adding friend:', error);
                });
            } else {
                console.error('No user found with that email');
            }
        }).catch(error => {
            console.error('Error finding user:', error);
        });
    }

    function loadMessages(userId) {
        db.collection('messages').doc(userId).collection('chats').orderBy('timestamp').onSnapshot(snapshot => {
            messageContainer.innerHTML = '';
            snapshot.forEach(doc => {
                const message = doc.data();
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.textContent = message.text;
                messageContainer.appendChild(messageElement);
            });
        });
    }

    function sendMessage(userId, messageText) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const messageData = { text: messageText, timestamp: timestamp };
        db.collection('messages').doc(userId).collection('chats').add(messageData).then(() => {
            sendMessageForm.reset();
        }).catch(error => {
            console.error('Error sending message:', error);
        });
    }

    function loadChallenges(userId) {
        db.collection('challenges').doc(userId).collection('list').get().then(snapshot => {
            snapshot.forEach(doc => {
                const challenge = doc.data();
                const challengeItem = document.createElement('li');
                challengeItem.textContent = challenge.name;
                challengeList.appendChild(challengeItem);
            });
        }).catch(error => {
            console.error('Error fetching challenges:', error);
        });
    }

    function loadStreak(userId) {
        db.collection('streaks').doc(userId).get().then(doc => {
            if (doc.exists) {
                const streakData = doc.data();
                dailyStreak.textContent = streakData.days;
            } else {
                const streakData = { days: 1, lastCompleted: firebase.firestore.FieldValue.serverTimestamp() };
                db.collection('streaks').doc(userId).set(streakData).then(() => {
                    dailyStreak.textContent = '1';
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
        const darkMode = preferencesForm['dark-mode'].checked;
        savePreferences(auth.currentUser.uid, { notification, darkMode });
    });

    function loadPreferences(userId) {
        db.collection('preferences').doc(userId).get().then(doc => {
            if (doc.exists) {
                const preferences = doc.data();
                preferencesForm.notification.checked = preferences.notification;
                preferencesForm['dark-mode'].checked = preferences.darkMode;
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

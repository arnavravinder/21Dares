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
          if (snapshot.empty) {
              console.error('No matching documents.');
              return;
          }

          snapshot.forEach(doc => {
              const friendData = doc.data();
              const friendId = doc.id;
              db.collection('friends').doc(userId).collection('list').doc(friendId).set(friendData)
                  .then(() => {
                      console.log('Friend added successfully.');
                      const friendElement = document.createElement('div');
                      friendElement.classList.add('friend');
                      friendElement.textContent = friendData.email;
                      friendContainer.appendChild(friendElement);
                  })
                  .catch(error => {
                      console.error('Error adding friend:', error);
                  });
          });
      }).catch(error => {
          console.error('Error finding user:', error);
      });
  }

  function sendMessage(userId, messageText) {
      const messageData = {
          senderId: userId,
          text: messageText,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };

      db.collection('messages').doc(userId).collection('list').add(messageData)
          .then(() => {
              console.log('Message sent successfully.');
              const messageElement = document.createElement('div');
              messageElement.classList.add('message');
              messageElement.textContent = messageText;
              messageContainer.appendChild(messageElement);
              sendMessageForm.reset();
          })
          .catch(error => {
              console.error('Error sending message:', error);
          });
  }

  function loadChallenges(userId) {
      // Implement loading challenges for the user
      const challengeRef = db.collection('challenges').where('userId', '==', userId);
      challengeRef.get().then(snapshot => {
          snapshot.forEach(doc => {
              const challenge = doc.data();
              const challengeElement = document.createElement('div');
              challengeElement.classList.add('challenge');
              challengeElement.textContent = challenge.title;
              challengeList.appendChild(challengeElement);
          });
      }).catch(error => {
          console.error('Error fetching challenges:', error);
      });
  }

  function loadStreak(userId) {
      // Implement loading daily streak for the user
      db.collection('users').doc(userId).get().then(doc => {
          if (doc.exists) {
              const userData = doc.data();
              dailyStreak.textContent = userData.streak || '0';
          } else {
              console.error('No such document!');
          }
      }).catch(error => {
          console.error('Error fetching streak:', error);
      });
  }

  function loadWeeklySummary(userId) {
      // Implement loading weekly summary for the user
      db.collection('summaries').doc(userId).get().then(doc => {
          if (doc.exists) {
              const summaryData = doc.data();
              weeklySummary.textContent = summaryData.summary || '';
          } else {
              console.error('No such document!');
          }
      }).catch(error => {
          console.error('Error fetching summary:', error);
      });
  }

  function loadBadges(userId) {
      // Implement loading badges for the user
      const badgesRef = db.collection('badges').where('userId', '==', userId);
      badgesRef.get().then(snapshot => {
          snapshot.forEach(doc => {
              const badge = doc.data();
              const badgeElement = document.createElement('div');
              badgeElement.classList.add('badge');
              badgeElement.textContent = badge.title;
              badgeContainer.appendChild(badgeElement);
          });
      }).catch(error => {
          console.error('Error fetching badges:', error);
      });
  }

  function loadPreferences(userId) {
      // Implement loading user preferences
      db.collection('preferences').doc(userId).get().then(doc => {
          if (doc.exists) {
              const preferencesData = doc.data();
              notification.checked = preferencesData.notification || false;
              darkMode.checked = preferencesData.darkMode || false;
          } else {
              console.error('No such document!');
          }
      }).catch(error => {
          console.error('Error fetching preferences:', error);
      });
  }

  function loadMessages(userId) {
      // Implement loading messages for the user
      db.collection('messages').doc(userId).collection('list').orderBy('timestamp', 'desc').limit(10).get().then(snapshot => {
          snapshot.forEach(doc => {
              const message = doc.data();
              const messageElement = document.createElement('div');
              messageElement.classList.add('message');
              messageElement.textContent = message.text;
              messageContainer.appendChild(messageElement);
          });
      }).catch(error => {
          console.error('Error fetching messages:', error);
      });
  }
});

function showSignUp() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('signup').style.display = 'block';
}

function showLogin() {
  document.getElementById('auth').style.display = 'block';
  document.getElementById('signup').style.display = 'none';
  document.getElementById('reset-password').style.display = 'none';
}

function showResetPassword() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('reset-password').style.display = 'block';
}

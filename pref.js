document.addEventListener('DOMContentLoaded', function () {
    const preferencesForm = document.getElementById('preferences-form');
    const notificationCheckbox = document.getElementById('notification');
    const darkModeCheckbox = document.getElementById('dark-mode');

    auth.onAuthStateChanged(user => {
        if (user) {
            loadPreferences(user.uid);
        } else {
            window.location.href = 'auth.html';
        }
    });

    preferencesForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userId = auth.currentUser.uid;
        const preferences = {
            notification: notificationCheckbox.checked,
            darkMode: darkModeCheckbox.checked
        };
        savePreferences(userId, preferences);
    });

    function loadPreferences(userId) {
        db.collection('preferences').doc(userId).get().then(doc => {
            if (doc.exists) {
                const preferencesData = doc.data();
                notificationCheckbox.checked = preferencesData.notification || false;
                darkModeCheckbox.checked = preferencesData.darkMode || false;
            } else {
                console.error('No preferences found for the user.');
            }
        }).catch(error => {
            console.error('Error fetching preferences:', error);
        });
    }

    function savePreferences(userId, preferences) {
        db.collection('preferences').doc(userId).set(preferences)
            .then(() => {
                console.log('Preferences saved successfully.');
            })
            .catch(error => {
                console.error('Error saving preferences:', error);
            });
    }
});

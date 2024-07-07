document.addEventListener('DOMContentLoaded', () => {
    AOS.init();

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌜' : '🌞';
    });

    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 25,
        speed: 400
    });
});

const challenges = [
    {
        title: "Day 6: Learn a New Skill",
        description: "Take the challenge to learn something new today. It could be a language, a musical instrument, or a coding skill!",
        image: "https://via.placeholder.com/400x200?text=Learn+a+New+Skill"
    },
    {
        title: "Day 7: Write a Journal Entry",
        description: "Reflect on your day by writing a journal entry. It's a great way to organize your thoughts and emotions.",
        image: "https://via.placeholder.com/400x200?text=Write+a+Journal+Entry"
    },
    {
        title: "Day 8: Try a New Recipe",
        description: "Challenge yourself to cook a new recipe. It's fun and rewarding to explore new flavors!",
        image: "https://via.placeholder.com/400x200?text=Try+a+New+Recipe"
    },
    {
        title: "Day 9: Practice Gratitude",
        description: "Take a moment to list things you're grateful for. Practicing gratitude can improve your overall well-being.",
        image: "https://via.placeholder.com/400x200?text=Practice+Gratitude"
    },
    {
        title: "Day 10: Digital Detox",
        description: "Disconnect from digital devices for a few hours. It's refreshing to take a break from screens!",
        image: "https://via.placeholder.com/400x200?text=Digital+Detox"
    }
];

function renderChallenges() {
    const contentSection = document.querySelector('.content');
    challenges.forEach(challenge => {
        const card = document.createElement('div');
        card.classList.add('card', 'challenge-card');
        card.setAttribute('data-aos', 'fade-up');

        const image = document.createElement('img');
        image.classList.add('card-image');
        image.src = challenge.image;
        image.alt = challenge.title;
        card.appendChild(image);

        const overlay = document.createElement('div');
        overlay.classList.add('card-overlay');
        card.appendChild(overlay);

        const title = document.createElement('h3');
        title.textContent = challenge.title;
        overlay.appendChild(title);

        const description = document.createElement('p');
        description.textContent = challenge.description;
        overlay.appendChild(description);

        const button = document.createElement('button');
        button.classList.add('card-button');
        button.textContent = 'Accept Challenge';
        overlay.appendChild(button);

        contentSection.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    AOS.init();
    renderChallenges();

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌜' : '🌞';
    });

    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 25,
        speed: 400
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const notificationsList = document.getElementById('notifications-list');

    const mockNotifications = [
        { message: 'You have completed a new challenge!', timestamp: '2024-07-15 10:30:00' },
        { message: 'New message received.', timestamp: '2024-07-14 15:20:00' },
    ];

    function renderNotifications() {
        notificationsList.innerHTML = '';

        mockNotifications.forEach(notification => {
            const listItem = document.createElement('li');
            listItem.classList.add('notification');
            listItem.innerHTML = `
                <div class="message">${notification.message}</div>
                <div class="timestamp">${formatTimestamp(notification.timestamp)}</div>
            `;
            notificationsList.appendChild(listItem);
        });
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    renderNotifications();
});

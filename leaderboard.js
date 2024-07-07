document.addEventListener('DOMContentLoaded', function () {
    const leaderboardList = document.getElementById('leaderboard-list');
    async function fetchLeaderboardData() {
        try {
            const response = await fetch('https://your-project-id.firebaseio.com/leaderboard.json');
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard data.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    }
    async function renderLeaderboard() {
        const leaderboardData = await fetchLeaderboardData();
        if (!leaderboardData) return;
        leaderboardList.innerHTML = '';

        leaderboardData.sort((a, b) => b.score - a.score);

        leaderboardData.forEach((user, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="username">${user.username}</span>
                <span class="score">${user.score}</span>
            `;
            leaderboardList.appendChild(listItem);
        });
    }

    renderLeaderboard();
});

// stats.js
import fs from 'fs';

const username = 'xkeshav';
const token = process.env.GITHUB_TOKEN;

async function getStats() {
  const headers = { Authorization: `token ${token}` };

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
  const repos = await reposRes.json();
  const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

  const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
  const user = await userRes.json();

  return {
    stars,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
  };
}

function generateSVG(stats) {
  return `
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1c1917"/>
    <text x="20" y="40" fill="#0891b2" font-size="20">GitHub Stats</text>
    <text x="20" y="80" fill="#ffffff">⭐ Stars: ${stats.stars}</text>
    <text x="20" y="110" fill="#ffffff">📦 Public Repos: ${stats.publicRepos}</text>
    <text x="20" y="140" fill="#ffffff">👥 Followers: ${stats.followers}</text>
    <text x="20" y="170" fill="#ffffff">➡️ Following: ${stats.following}</text>
  </svg>
  `;
}

(async () => {
  const stats = await getStats();
  const svg = generateSVG(stats);
  fs.writeFileSync('stats.svg', svg);
})();

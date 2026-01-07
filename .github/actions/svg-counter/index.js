const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

async function getGitHubTraffic() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/traffic/views', {
    owner: 'xkeshav', // replace with your username
    repo: 'xkeshav', // replace with your repo name
  });
  return data.count;
}

async function getLifetimeCount() {
  const res = await fetch('https://api.countapi.xyz/hit/xkeshav/profile');
  const data = await res.json();
  return data.value;
}

async function run() {
  const filename = process.env.INPUT_FILENAME || 'count.svg';
  const trafficCount = await getGitHubTraffic();
  const lifetimeCount = await getLifetimeCount();

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80">
  <rect width="300" height="80" fill="#222"/>
  <text x="150" y="30" font-size="20" text-anchor="middle" fill="white">
    14-day views: ${trafficCount}
  </text>
  <text x="150" y="60" font-size="20" text-anchor="middle" fill="white">
    Lifetime hits: ${lifetimeCount}
  </text>
</svg>
`;

  const outputPath = path.join(process.env.GITHUB_WORKSPACE || process.cwd(), filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Generated ${outputPath}`);
}

run();

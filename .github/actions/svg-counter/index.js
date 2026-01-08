import fs from "fs";
import path from "path";

async function getLifetimeCount() {
  const counter = JSON.parse(fs.readFileSync("./counter.json", "utf8"));
  counter.value++;
  fs.writeFileSync("./counter.json", JSON.stringify(counter));
  return counter.value;
}

async function run() {
  console.log("Running updated index.js without node-fetch");
  const filename = process.env.INPUT_FILENAME || "count.svg";
  const lifetimeCount = await getLifetimeCount();

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80">
  <rect width="300" height="80" fill="#222"/>
  <text x="150" y="45" font-size="20" text-anchor="middle" fill="white">
    Lifetime hits: ${lifetimeCount}
  </text>
</svg>
`;

  const workspace = process.env.GITHUB_WORKSPACE || path.resolve(".");
  const outputPath = path.join(workspace, filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Generated ${outputPath}`);
}

run().catch((err) => {
  console.error("Action failed:", err);
  process.exit(1);
});

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load JSON
const json = JSON.parse(fs.readFileSync("staker-configs.json", "utf-8"));

// Get the dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate .env files
function generateEnvFiles(json) {
  for (let network in json) {
    let content = "";
    for (let clientType in json[network]) {
      for (let client in json[network][clientType]) {
        for (let key in json[network][clientType][client]) {
          content += `${network.toUpperCase()}_${clientType.toUpperCase()}_${client.toUpperCase()}_${key.toUpperCase()}=${
            json[network][clientType][client][key]
          }\n`;
        }
      }
    }

    const buildDir = path.join(__dirname, "build");
    // Check if the build directory exists, if not, create it
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir);
    }

    fs.writeFileSync(path.join(buildDir, `.${network}`), content);
  }
}

generateEnvFiles(json);

const buildDir = path.join(__dirname, "build");
// Check if the build directory exists, if not, create it
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Generate JS module
fs.writeFileSync(
  path.join(buildDir, "stakerConfigs.js"),
  `export default ${JSON.stringify(json, null, 2)};`
);

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
    fs.writeFileSync(path.join(__dirname, "build", `.${network}`), content);
  }
}

generateEnvFiles(json);

// Generate JS module
fs.writeFileSync(
  path.join(__dirname, "build/stakerConfigs.js"),
  `export default ${JSON.stringify(json, null, 2)};`
);

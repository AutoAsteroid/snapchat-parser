import fs from "node:fs";

// Copy example.config.json to config.json if it doesn't exist yet and strip comments
if (!fs.existsSync("config.json")) {
    const rawExample = fs.readFileSync("config.example.json", "utf-8");
    const cleanExample = rawExample.replace(/\/\/.*$/gm, "");
    const parsedConfig = JSON.parse(cleanExample);
    
    parsedConfig.nicknames = {};
    fs.writeFileSync("config.json", JSON.stringify(parsedConfig, null, 4));
}

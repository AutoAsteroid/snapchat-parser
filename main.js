
const fs = require("fs");
const path = require("path");
const parser = require("./src/parser");

async function main() {
    /**
     * This program converts and parses Snapchat data into proper readable HTML archives.
     * The current HTML files that Snapchat generates lacks media and is generally ugly.
     */
    const chatHistory = require("./data/json/chat_history.json");
    const snapHistory = require("./data/json/snap_history.json");

    const userMediaMap = parser.mapUserMedia();
    // fs.writeFileSync("./map.json", JSON.stringify(userMediaMap, null, 4));
    
    const fullHistory = parser.mergeUserData(chatHistory, snapHistory);
    console.log("├── Successfully parsed your Snapchat chat history!");

    for (const [ username, conversation ] of Object.entries(fullHistory))
        await parser.createArchive(username, conversation, userMediaMap);

    console.log(`└── Successfully archived ${Object.keys(fullHistory).length} users!`);
}

main();
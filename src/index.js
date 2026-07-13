import fs from "fs";
import path from "path";
import * as parser from "./parser.js";

/**
 * This program converts and parses Snapchat data into proper readable HTML archives.
 * The current HTML files that Snapchat generates lacks media and is generally ugly.
 */
import chatHistory from "../data/json/chat_history.json" with { type: "json" };
import snapHistory from "../data/json/snap_history.json" with { type: "json" };

const userMediaMap = parser.mapUserMedia();
const fullHistory = parser.mergeUserData(chatHistory, snapHistory);

console.log("├── Successfully parsed your Snapchat chat history!");

for (const [ username, conversation ] of Object.entries(fullHistory))
    await parser.createArchive(username, conversation, userMediaMap);

console.log(`└── Successfully archived ${Object.keys(fullHistory).length} users!\n`);

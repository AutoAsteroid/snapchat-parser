/**
 * This program converts and parses Snapchat data into formatted readable HTML archives.
 * The current HTML files Snapchat generates lacks inline media and is user unfriendly.
 */

import fs from "node:fs";
import path from "node:path";

// Import provided data files provided from https://accounts.snapchat.com/v2/download-my-data
import chatHistory from "../data/json/chat_history.json" with { type: "json" };
import snapHistory from "../data/json/snap_history.json" with { type: "json" };

import { mapUserMedia, mergeUserData, createArchive } from "./parser.js";

/**
 * userMediaMap is an object mapping files in data/chat_media to their relative timestamps
 * fullHistory is a flatted object of your sorted chats INCLUDING their snap history
 */
const userMediaMap = mapUserMedia();
const fullHistory = mergeUserData(chatHistory, snapHistory);

console.log("├── Successfully parsed your Snapchat chat history!");

/**
 * Sorts your conversation media and chats into dedicated folders for each conversation
 */
for (const [ username, conversation ] of Object.entries(fullHistory))
    await createArchive(username, conversation, userMediaMap);

console.log(`└── Successfully archived ${Object.keys(fullHistory).length} users!\n`);

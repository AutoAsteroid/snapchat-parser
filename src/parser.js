import fs from "fs";
import path from "path";
import crypto from "crypto";

import config from "../config.json" with { type: "json" };
import ChatHTML from "./html.js";

/**
 * Combine Snapchat data by user with arrays of chats and snaps because Snapchat stores 
 * chats and snap history in separate files
 * 
 * @param {...Object} objects Objects of user data to combine (snap and chat history)
 * @returns Combined object of sorted arrays of chat and snap history
 */
export function mergeUserData(...objects) {
    const merged = {};
    const allKeys = new Set(objects.flatMap(obj => Object.keys(obj)));
    const time = "Created(microseconds)";

    for (const key of allKeys) {
        merged[key] = objects
            .flatMap(object => object[key] || [])
            .sort((a, b) => a[time] - b[time]);
    }
    return merged;
}

/**
 * Maps all media in chat_media to their relative birth times to match media messages
 * chat_history.json has Media IDs keys, but this only maps to uploaded/attached media
 * snap_history.json does NOT have the same property to map snaps to messages
 * 
 * @param {string} directory Folder holding all the chat_media given by Snapchat
 */
export function mapUserMedia(directory = path.join("data", "chat_media")) {
    const userMediaMap = {};
    
    // Bucket media files to the nearest second for efficient O(1) lookups
    for (const file of fs.readdirSync(directory)) {
        const fullPath = path.join(directory, file);
        const time = fs.statSync(fullPath).birthtimeMs;

        const seconds = Math.round(time / 1000);
        userMediaMap[seconds] ??= [];
        userMediaMap[seconds].push(file);
    }

    /**
     * Process bucketed media files to make sure there are no duplicate files
     * This happens if you sent the same snap to multiple people at the same time,
     * which breaks our inline media mapping, matching all of them to one chat
     */
    for (const [ seconds, files ] of Object.entries(userMediaMap)) {
        if (files.length <= 1) continue;

        const uniqueFiles = [];
        const seenHashes = new Set();

        for (const file of files) {
            const buffer = fs.readFileSync(path.join(directory, file));
            const hash = crypto.createHash("md5").update(buffer).digest("hex");

            if (seenHashes.has(hash)) continue;
            seenHashes.add(hash);
            uniqueFiles.push(file);
        }
        userMediaMap[seconds] = uniqueFiles;
    }

    // Maps nearest second to media files sent within that nearest second
    return userMediaMap;
}

/**
 * Returns an array of the matching media files at the nearest given millisecond
 * @param {Object} mediaMap Media map object generated from parser/mapUserMedia() 
 * @param {number} milliseconds Date that these files might have been sent
 * @param {number} [window=1] Window to find matching message timestamps in
 */
export function findMedia(mediaMap, milliseconds, window = 1) {
    const seconds = Math.round(milliseconds / 1000);
    const media = [...(mediaMap[seconds] ?? [])];

    // Fetch matching media buckets to this timestamp in O(1) time
    for (let i = 1; i <= window; i++) {
        media.push(...(mediaMap[seconds - i] ?? []));
        media.push(...(mediaMap[seconds + i] ?? []));
    }
    return media;
}

/**
 * Parse and compile our Snapchat conversation into a structured standalone HTML archive
 * @param {string} username The Snapchat username of the person we are chatting with
 * @param {Array} conversation The Snapchat conversation with merged snaps and chats
 * @param {Object<string, string[]>} mediaMap Media mapping of birthtimes to media  
 */
export async function createArchive(username, conversation, mediaMap) {
    const mediaFolder = path.join("output", username, "media");
    const archive = new ChatHTML();
    let previousDate = "";

    // Pre create subdirectories for each unique sender to store media file outputs
    for (const sender of new Set(conversation.map(({ From }) => From))) {
        fs.mkdirSync(path.join(mediaFolder, sender), { recursive: true });
    }

    // For some reason Snapchat actually gives us "Created(microseconds)" in unix milliseconds?
    for (const { From, "Media Type": Type, "Created(microseconds)": Time, Content, IsSender } of conversation) {
        
        // Copy matching media into the output so that our HTML can inline them
        const mediaFiles = findMedia(mediaMap, Time, 1);

        mediaFiles.forEach(fileName => fs.copyFileSync(
            path.join("data", "chat_media", fileName), 
            path.join("output", username, "media", From, fileName))
        );

        // Format raw timestamps into local human-readable date and time strings
        const [ date, time ] = new Intl.DateTimeFormat("en-US", {
            timeZone: config.timezone || undefined,
            dateStyle: "long",
            timeStyle: "medium",
        }).format(Time).split(" at ");

        if (date !== previousDate)
            archive.addDay(date);

        // Update the previous date so we know when to add a new day inbetween chats
        previousDate = date;
    
        /**
         * Media type can vary between TEXT, NOTE, IMAGE, VIDEO, and MEDIA
         * IMAGE and VIDEO are snaps and MEDIA is uploaded images or videos
         * NOTES are voice note mp4 files. Can also be STICKER or STATUS
         */
        const name = config.nicknames[From] ?? From;
        const media = mediaFiles.map(id => path.join("media", From, id));

        archive.addMessage({ name, time, content: Content, media, type: Type, sender: IsSender });
    }

    fs.writeFileSync(path.join("output", username, username + ".html"), archive.toHTML());
    console.log(`├── Successfully saved: ${username} [${conversation.length} messages]`);
};

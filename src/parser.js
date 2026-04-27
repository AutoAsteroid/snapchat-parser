
const fs = require("fs");
const path = require("path");
const config = require("../config.json");
const builder = require("./html");

/**
 * Combine Snapchat data by user with arrays of chats and snaps, because for
 * some reason Snapchat stores chats and snap hisory in separate files.
 * 
 * @param {...Object} objects Objects of user data to combine
 * @returns Combined object of sorted arrays of chat and snap history
 */
function mergeUserData(...objects) {
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
 * Maps all media in chat_media to their relative birth times to match messages
 * chat_history.json has a Media IDs key, but this only maps to attached media.
 * snap_history.json does not have the same property to match snaps to messages.
 * 
 * @param {string} directory Folder holding all the chat_media given by Snapchat
 */
function mapUserMedia(directory = path.join("data", "chat_media")) {
    const userMediaMap = {};
    
    for (const file of fs.readdirSync(directory)) {

        const fullPath = path.join(directory, file);
        const creation = fs.statSync(fullPath).birthtimeMs;

        // For some reason these are offset by 7 hours
        const offset = 1000 * 60 * 60 * 7;
        const time = creation - offset;
        userMediaMap[time] ??= [];
        userMediaMap[time].push(file);
    }
    return userMediaMap;
}

/**
 * Parse our conversation into an HTML file of our chat with said username
 * @param {string} username The username of the person we are chatting with
 * @param {Array} conversation The snapchat conversation with that username
 * @param {Object<array>} userMediaMap Mapping of birthtimes to media
 */
async function createArchive(username, conversation, userMediaMap) {
    
    const mediaFolder = path.join("output", username, "media");
    const archive = new builder.ChatHTML();
    let previousDate = "";

    for (const { From, "Media Type": Type, "Created(microseconds)": Time, Content, IsSender } of conversation) {

        fs.mkdirSync(path.join(mediaFolder, From), { recursive: true });
        /**
         * For some reason Snapchat gives us Created(microseconds) the time in milliseconds?
         * Fetch all media files with a similar creation date as this Snapchat message
         */
        const matchTimes = Object.keys(userMediaMap).filter(time => Math.abs(Time - time) <= 2000);
        const matchFiles = matchTimes.flatMap(time => userMediaMap[time]);
        const media = matchFiles.map(id => path.join("media", From, id));
        
        for (file of media) fs.copyFileSync(
            path.join("data", "chat_media", path.basename(file)), 
            path.join("output", username, file));

        const [ date, time ] = new Intl.DateTimeFormat("en-US", {
            timeZone: config.timezone,
            dateStyle: "long",
            timeStyle: "medium",
        }).format(Time).split(" at ");

        if (date !== previousDate) archive.addDay(date); previousDate = date;

        /**
         * Media type can vary between TEXT, NOTE, IMAGE, VIDEO, and MEDIA
         * Image and video are snaps and media is image/video uploads
         * Notes are voice note mp4 files. Can also be STICKER or STATUS
         */
        const name = config.nicknames[From] ?? From;

        archive.addMessage({ name, time, content: Content, media, type: Type, sender: IsSender });
    }

    fs.writeFileSync(path.join("output", username, username + ".html"), archive.toHTML());
    console.log(`├── Successfully saved: ${username} [${conversation.length} messages]`);
};

module.exports = { mergeUserData, mapUserMedia, createArchive };
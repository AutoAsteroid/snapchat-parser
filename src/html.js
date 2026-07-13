import css from "./css.js";

/**
 * @typedef {Object} ChatMessage Message body generated from createArchive()
 * @property {string} name The message sender's username or display alias.
 * @property {string} time Pre-formatted human-readable clock timestamp.
 * @property {boolean} sender True if sent by the primary account holder.
 * @property {string} type Snapchat's internal message type classification flag
 * @property {string} [content] Text message body for chat messages
 * @property {string[]} [media] Local relative paths for inlined HTML media
 */

const STATUS_MESSAGES = {
    STICKER: "SENT A STICKER",
    STATUS: "CHANGED STATUS",
    STATUSERASEDMESSAGE: "MESSAGE DELETED",
    STATUSERASEDSNAPMESSAGE: "DELETED A SNAP"
};

export default class ChatHTML {
    /**
     * Builds the raw HTML messages from our processed Snapchat conversation messages 
     * to be wrapped in our final Snapchat style CSS chat interface
     */
    constructor() {
        this.messages = [];
        this.lastSender = null;
    }

    /**
     * Adds a day label inbetween the chat messages to signify a new day in the chat
     * @param {string} label Day label to inline between the chat conversation
     */
    addDay(label) {
        this.messages.push(`<div class="day">${this.escapeHTML(label.toUpperCase())}</div>`);
        this.lastSender = null;
    }

    /**
     * Adds a chat message into the chat conversation. Includes all types of media messages
     * @param {ChatMessage} message The ChatMessage generated from parser/archiveChat()
     */
    addMessage(message) {
        this.messages.push(this.renderMessage(message));
    }

     /**
     * Converts a Snapchat ChatMessage into its raw HTML representation for our output HTML
     * @param {ChatMessage} message The ChatMessage generated from parser/archiveChat()
     */
    renderMessage(message) {
        const { name, time, sender, type, content, media = [] } = message;
        const side = sender ? "sent" : "received";
        const showName = this.lastSender !== name;

        this.lastSender = message.name;

        // Static routing dictionary pointing directly to bound class instances
        const renderers = {
            TEXT:  () => this.renderText(content ?? ""),
            MEDIA: () => this.renderMedia(media),
            IMAGE: () => this.renderImage(media[0]),
            VIDEO: () => this.renderVideo(media[0]),
            NOTE:  () => this.renderAudio(media[0])
        };

        // Render the message content body dynamically from our lookup tables
        const body = renderers[type] 
            ? renderers[type]() 
            : `<div class="text">${STATUS_MESSAGES[type] ?? "UNKNOWN MESSAGE"}</div>`;

        // Keeps HTML formatting perfectly collapsed into one line per message
        return [
            `<div class="message ${side}">`,
            showName && `<div class="username">${this.escapeHTML(name)}</div>`,
            `<div class="content">${body}</div>`,
            `<div class="meta">${this.escapeHTML(time)}</div>`,
            `</div>`
        ].filter(Boolean).join("");
    }

    /**
     * @param {string} text Message content to wrap into HTML
     * @returns {string} The HTML wrapped chat message
     */
    renderText(text) {
        return `<div class="text">${this.escapeHTML(text)}</div>`;
    }

    /**
     * @param {Array<string>} media Media array to wrap into HTML
     * @returns {string} The HTML wrapped media grouping
     */
    renderMedia(media) {
        const content = media.map(file => file.endsWith(".mp4")
            ? `<video controls src="${file}"></video>`
            : `<img src="${file}" loading="lazy">`).join("");
        
        return `<div class="media-group">${content}</div>`;
    }

    /**
     * @param {string} src Snapchat image snap path to wrap into HTML
     * @returns {string} The HTML wrapped snap image
     */
    renderImage(src) {
        return src
            ? `<img src="${src}" loading="lazy">`
            : `<div class="text">SNAP IMAGE NOT SAVED</div>`;
    }

    /**
     * @param {string} src Snapchat video snap path to wrap into HTML
     * @returns {string} The HTML wrapped snap video
     */
    renderVideo(src) {
        return src
            ? `<video controls src="${src}"></video>`
            : `<div class="text">SNAP VIDEO NOT SAVED</div>`;
    }

    /**
     * @param {string} src Voice note path to wrap into HTML
     * @returns {string} The HTML wrapped voice note audio file
     */
    renderAudio(src) {
        return src
            ? `<audio controls src="${src}"></audio>`
            : `<div class="text">VOICE NOTE NOT SAVED</div>`;
    }

    /**
     * @param {string} text Text string to escape to safe HTML
     * @returns {string} Safely wrapped HTML string body
     */
    escapeHTML(text) {
        return String(text)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }

    /**
     * Generates the final HTML file from our list of added messages
     * @returns {string} Standalone Snapchat style chat interface
     */
    toHTML() {
        return css(this.messages);
    }
}

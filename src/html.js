const { css } = require("./css");

class ChatHTML {
    constructor() {
        this.messages = [];
        this.lastSender = null;
    }

    addDay(label) {
        this.messages.push(`<div class="day">${label.toUpperCase()}</div>`);
        this.lastSender = null;
    }

    addMessage(msg) {
        this.messages.push(this.renderMessage(msg));
    }

    renderMessage(msg) {
        const name = msg.name;
        const time = msg.time;
        const side = msg.sender ? "sent" : "received";

        const showName = this.lastSender !== name;
        this.lastSender = name;

        let body = "";

        if (msg.type === "TEXT") {
            body = this.renderText(msg.content);
        }
        if (msg.type === "MEDIA") {
            body = this.renderMedia(msg.media);
        }
        if (msg.type === "IMAGE") {
            body = this.renderImage(msg.media[0]);
        }
        if (msg.type === "VIDEO") {
            body = this.renderVideo(msg.media[0]);
        }
        if (msg.type === "NOTE") {
            body = this.renderAudio(msg.media[0]);
        }
        if (msg.type === "STICKER") {
            body = `<div class="text">SENT A STICKER</div>`;
        }
        if (msg.type === "STATUS") {
            body = `<div class="text">CHANGED STATUS</div>`;
        }
        if (msg.type === "STATUSERASEDMESSAGE") {
            body = `<div class="text">MESSAGE DELETED</div>`;
        }
        if (msg.type === "STATUSERASEDSNAPMESSAGE") {
            body = `<div class="text">DELETED A SNAP</div>`;
        }

        return `<div class="message ${side}">
        ${showName ? `<div class="username">${name}</div>` : ""}
            <div class="content">${body}</div>
            <div class="meta">${time}</div>
        </div>`.trim();
    }

    renderText(text) {
        return `<div class="text">${text}</div>`;
    }

    renderMedia(src) {
        const media = src.map(media => media.endsWith(".mp4") ? 
            `<video controls src="${media}"></video>` : 
            `<img src="${media}" loading="lazy">`).join("");

        return `<div class="media-group">${media}</div>`;
    }

    renderImage(src) {
        return src 
            ? `<img src="${src}" loading="lazy">` 
            : `<div class="text">SNAP IMAGE NOT SAVED</div>`;
    }

    renderVideo(src) {
        return src 
            ? `<video controls src="${src}"></video>` 
            : `<div class="text">SNAP VIDEO NOT SAVED</div>`;
    }

    renderAudio(src) {
        return src 
            ? `<audio controls src="${src}"></audio>` 
            : `<div class="text">VOICE NOTE NOT SAVED</div>`;
    }

    toHTML() {
        return css(this.messages);
    }
}

module.exports = { ChatHTML };
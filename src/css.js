import config from "../config.json" with { type: "json" };

const { background, sent, received } = config.colors;

const css = messages => `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 
                "Avenir Next", 
                "Nunito", 
                system-ui, -apple-system, sans-serif;
            margin: 0;
            background: ${background};
        }

        .messages {
            width: 100%;
            height: 100vh;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            padding: 10px;
            box-sizing: border-box;
        }

        .message {
            width: 100%;
            text-align: left;
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-areas: 
                "username username"
                "content  meta";
            gap: 4px 12px;
        }

        .username {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 10px;
            margin-bottom: 0;
        }

        .content {
            grid-area: content;
            padding: 0 0 0 8px;
            border-left: 3px solid transparent;
            box-sizing: border-box;
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
        }

        .sent .content {
            border-color: ${sent};
        }

        .sent .username {
            color: ${sent}
        }

        .received .content {
            border-color: ${received};
        }

        .received .username {
            color: ${received}
        }

        .text {
            font-size: 15px;
            line-height: 1.35;
            font-weight: 400;
            white-space: pre-wrap;
            word-break: break-word;
            color: #dbdbdb
        }

        .meta {
            grid-area: meta;
            font-size: 10px;
            color: #aaaaaa;
            margin-top: 0;
            white-space: nowrap;
            align-self: end; 
            margin-bottom: 2px;
        }

        .media-group {
            display: flex;
            flex-wrap: wrap;
        }

        img, video {
            margin-top: 6px;
            margin-bottom: 6px;
            max-width: 95%;
            height: auto;
            border-radius: 12px;
            object-fit: cover;
            display: block;
        }

        audio {
            width: 220px;
            margin-top: 5px;
        }

        .day {
            text-align: center;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #8e8e93;
            margin: 20px 0 10px 0;
        }

        .sent + .sent,
        .received + .received {
            margin-top: -4px;
        }

        .sent + .sent .content,
        .received + .received .content {
            border-top-left-radius: 0px;
        }

        .sent:has(+ .sent) .content,
        .received:has(+ .received) .content {
            border-bottom-left-radius: 0px;
        }

        .opened {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: "Avenir Next", "Nunito", sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #dbdbdb;
            background: transparent; 
            border: 0.5px solid #aaaaaa;
            padding: 10px 14px;
            padding-right: 100px;
            border-radius: 12px;
            user-select: none;
            margin: 4px 0;
        }

        .opened::before {
            content: "";
            display: inline-block;
            width: 16px;
            height: 16px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        }

        .opened--image::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ee2345' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='5 3 19 12 5 21 9 12 5 3'/%3E%3C/svg%3E");
        }

        .opened--video::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a349a4' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='5 3 19 12 5 21 9 12 5 3'/%3E%3C/svg%3E");
        }
    </style>
</head>

<body>
    <div class="messages">

${messages.join("\n")}

    </div>
</body>

</html>`.trim();

export default css;

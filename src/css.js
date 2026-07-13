import config from "../config.json" with { type: "json" };

const { background, sent, received } = config.colors;

const css = messages => `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family:
                -apple-system, BlinkMacSystemFont,
                "Segoe UI", Roboto,
                "Helvetica Neue", Arial,
                sans-serif;
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
            max-width: 85%;
            margin: 4px 0;
            display: flex;
            flex-direction: column;
        }

        .username {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .content {
            padding: 6px 10px;
            border-left: 4px solid;
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
            font-size: 14px;
            line-height: 1.4;
            white-space: pre-wrap;
            color: #dbdbdb
        }

        .meta {
            font-size: 10px;
            color: #888;
            margin-top: 2px;
        }

        .media-group {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 5px;
        }

        .media-group img,
        .media-group video {
            width: 100%;
            border-radius: 10px;
            object-fit: cover;
        }

        img, video {
            max-width: 260px;
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
    </style>
</head>

<body>
    <div class="messages">

${messages.join("\n")}

    </div>
</body>

</html>`.trim();

export default css;

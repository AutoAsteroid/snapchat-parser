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
            background: #1e1e1e;
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
            border-color: #0faeff;
        }

        .sent .username {
            color: #0faeff
        }

        .received .content {
            border-color: #d93851;
        }

        .received .username {
            color: #d93851
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

        img,
        video {
            max-width: 220px;
            border-radius: 10px;
            margin-top: 5px;
        }

        audio {
            width: 220px;
            margin-top: 5px;
        }

        .day {
            text-align: center;
            font-size: 12px;
            color: #999;
            margin: 10px 0;
        }
    </style>
</head>

<body>
    <div class="messages">
        ${messages.join("")}
    </div>
</body>

</html>`;

module.exports = { css };
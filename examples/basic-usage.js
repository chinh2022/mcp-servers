// examples/basic-usage.js
const YoutubeHandler = require('../src/youtube/handler');
const GoogleDriveHandler = require('../src/google-drive/handler');

async function main() {
    // YouTube example
    const youtubeHandler = new YoutubeHandler({
        YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY
    });

    const youtubeResult = await youtubeHandler.handle({
        url: 'https://youtube.com/watch?v=...'
    });

    // Google Drive example
    const driveHandler = new GoogleDriveHandler({
        GOOGLE_DRIVE_CREDENTIALS: process.env.GOOGLE_DRIVE_CREDENTIALS
    });

    const driveResult = await driveHandler.handle({
        folderId: 'your-folder-id'
    });
}

main().catch(console.error);
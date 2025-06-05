// src/google-drive/handler.js
const BaseHandler = require('../base/handler');
const { google } = require('googleapis');

class GoogleDriveHandler extends BaseHandler {
    constructor(config) {
        super(config);
        this.drive = google.drive({ version: 'v3', auth: config.GOOGLE_DRIVE_CREDENTIALS });
    }

    async handle(input) {
        try {
            const files = await this.listFiles(input.folderId);
            return this.sendSuccessResponse({ files });
        } catch (error) {
            return this.sendErrorResponse(error);
        }
    }

    async listFiles(folderId) {
        const response = await this.drive.files.list({
            q: `'${folderId}' in parents`,
            fields: 'files(id, name, mimeType)'
        });
        return response.data.files;
    }
}

module.exports = GoogleDriveHandler;
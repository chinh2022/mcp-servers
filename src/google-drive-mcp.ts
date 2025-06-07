import { google, drive_v3 } from 'googleapis';
import winston from 'winston';
import * as fs from 'fs/promises';
import path from 'path';

interface GoogleDriveConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

class GoogleDriveMCP {
    private oauth2Client: any;
    private drive: drive_v3.Drive;
    private logger: winston.Logger;
    private tokensFile: string;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console()
            ]
        });

        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID || '',
            process.env.GOOGLE_CLIENT_SECRET || '',
            process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback'
        );

        this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
        this.tokensFile = path.join(__dirname, '..', 'src', 'google_drive_tokens.json');
    }

    async initialize() {
        try {
            this.logger.info('Initializing Google Drive MCP...');

            // Try to load saved tokens
            const tokensJson = await fs.readFile(this.tokensFile, 'utf-8');
            const tokens = JSON.parse(tokensJson);

            this.oauth2Client.setCredentials(tokens);
            this.logger.info('Credentials set from token object.');
        } catch (error) {
            this.logger.error('Error initializing Google Drive MCP:', error);
            throw error;
        }
    }

    async listFiles(pageSize: number = 10): Promise<any[]> {
        try {
            const response = await this.drive.files.list({
                pageSize: pageSize,
                fields: 'nextPageToken, files(id, name, mimeType)',
            });

            return response.data.files || [];
        } catch (error) {
            this.logger.error('Error listing files:', error);
            throw error;
        }
    }

    async readFile(fileId: string): Promise<string> {
        try {
            const fileMetadata = await this.drive.files.get({
                fileId: fileId,
                fields: 'mimeType'
            });
            const mimeType = fileMetadata.data.mimeType;

            this.logger.info(`Reading file ${fileId} with mimeType ${mimeType}`);

            if (mimeType === 'application/vnd.google-apps.document') {
                const response = await this.drive.files.export({
                    fileId: fileId,
                    mimeType: 'text/plain'
                });
                return response.data as string;
            } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
                const response = await this.drive.files.export({
                    fileId: fileId,
                    mimeType: 'text/csv'
                });
                return response.data as string;
            } else if (mimeType === 'application/vnd.google-apps.presentation') {
                const response = await this.drive.files.export({
                    fileId: fileId,
                    mimeType: 'text/plain'
                });
                return response.data as string;
            } else {
                const response = await this.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                }, { responseType: 'text' });
                return response.data as string;
            }
        } catch (error) {
            this.logger.error('Error reading file:', error);
            throw error;
        }
    }
}

// Create and export a singleton instance
const driveMCP = new GoogleDriveMCP();

export default driveMCP; 
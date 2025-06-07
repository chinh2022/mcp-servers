"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const winston_1 = __importDefault(require("winston"));
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class GoogleDriveMCP {
    constructor() {
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console()
            ]
        });
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID || '', process.env.GOOGLE_CLIENT_SECRET || '', process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback');
        this.drive = googleapis_1.google.drive({ version: 'v3', auth: this.oauth2Client });
        this.tokensFile = path_1.default.join(__dirname, '..', 'src', 'google_drive_tokens.json');
    }
    async initialize() {
        try {
            this.logger.info('Initializing Google Drive MCP...');
            // Try to load saved tokens
            const tokensJson = await fs.readFile(this.tokensFile, 'utf-8');
            const tokens = JSON.parse(tokensJson);
            this.oauth2Client.setCredentials(tokens);
            this.logger.info('Credentials set from token object.');
        }
        catch (error) {
            this.logger.error('Error initializing Google Drive MCP:', error);
            throw error;
        }
    }
    async listFiles(pageSize = 10) {
        try {
            const response = await this.drive.files.list({
                pageSize: pageSize,
                fields: 'nextPageToken, files(id, name, mimeType)',
            });
            return response.data.files || [];
        }
        catch (error) {
            this.logger.error('Error listing files:', error);
            throw error;
        }
    }
    async readFile(fileId) {
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
                return response.data;
            }
            else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
                const response = await this.drive.files.export({
                    fileId: fileId,
                    mimeType: 'text/csv'
                });
                return response.data;
            }
            else if (mimeType === 'application/vnd.google-apps.presentation') {
                const response = await this.drive.files.export({
                    fileId: fileId,
                    mimeType: 'text/plain'
                });
                return response.data;
            }
            else {
                const response = await this.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                }, { responseType: 'text' });
                return response.data;
            }
        }
        catch (error) {
            this.logger.error('Error reading file:', error);
            throw error;
        }
    }
}
// Create and export a singleton instance
const driveMCP = new GoogleDriveMCP();
exports.default = driveMCP;

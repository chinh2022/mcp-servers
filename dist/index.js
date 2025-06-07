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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const google_drive_mcp_1 = __importDefault(require("./google-drive-mcp"));
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const TOKENS_FILE = path_1.default.join(__dirname, '..', 'src', 'google_drive_tokens.json');
async function authenticate() {
    try {
        // Try to load saved tokens
        const tokensJson = await fs.readFile(TOKENS_FILE, 'utf-8');
        const tokens = JSON.parse(tokensJson);
        await google_drive_mcp_1.default.initialize();
        console.log('Using saved Google Drive tokens.');
    }
    catch (error) {
        console.error('Error initializing Google Drive MCP:', error);
        throw error;
    }
}
async function main() {
    try {
        // Perform authentication (will use saved tokens or start auth flow)
        await authenticate();
        const args = process.argv.slice(2);
        const command = args[0];
        switch (command) {
            case 'list': {
                const pageSize = parseInt(args[1] || '10', 10);
                console.log(`\nListing files (pageSize: ${pageSize})...`);
                const files = await google_drive_mcp_1.default.listFiles(pageSize);
                console.log('Files:', JSON.stringify(files, null, 2));
                break;
            }
            case 'read': {
                const fileId = args[1];
                if (!fileId) {
                    console.error('Error: File ID is required for read command.');
                    process.exit(1);
                }
                console.log(`\nReading content of file (ID: ${fileId})...`);
                try {
                    const content = await google_drive_mcp_1.default.readFile(fileId);
                    console.log('File content:', content);
                }
                catch (error) {
                    console.error('Error reading file:', error);
                }
                break;
            }
            default: {
                console.log('Usage: npm run start <command> [args]');
                console.log('Commands:');
                console.log('  list [pageSize] - List files in Google Drive');
                console.log('  read <fileId> - Read content of a file');
                break;
            }
        }
    }
    catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
}
main().catch(console.error);
__exportStar(require("./youtube"), exports);
// Export other modules as they are implemented
// export * from './google-drive';
// export * from './figma';
// export * from './jira'; 

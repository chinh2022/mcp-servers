import dotenv from 'dotenv';
import driveMCP from './google-drive-mcp';
import * as fs from 'fs/promises';
import path from 'path';

dotenv.config();

const TOKENS_FILE = path.join(__dirname, '..', 'src', 'google_drive_tokens.json');

async function authenticate(): Promise<void> {
    try {
        // Try to load saved tokens
        const tokensJson = await fs.readFile(TOKENS_FILE, 'utf-8');
        const tokens = JSON.parse(tokensJson);
        await driveMCP.initialize();
        console.log('Using saved Google Drive tokens.');
    } catch (error) {
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
                const files = await driveMCP.listFiles(pageSize);
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
                    const content = await driveMCP.readFile(fileId);
                    console.log('File content:', content);
                } catch (error) {
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
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
}

main().catch(console.error);

export * from './youtube';
// Export other modules as they are implemented
// export * from './google-drive';
// export * from './figma';
// export * from './jira'; 
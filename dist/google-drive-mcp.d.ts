declare class GoogleDriveMCP {
    private oauth2Client;
    private drive;
    private logger;
    private tokensFile;
    constructor();
    initialize(): Promise<void>;
    listFiles(pageSize?: number): Promise<any[]>;
    readFile(fileId: string): Promise<string>;
}
declare const driveMCP: GoogleDriveMCP;
export default driveMCP;

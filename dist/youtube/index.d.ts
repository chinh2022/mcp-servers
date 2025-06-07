export interface YouTubeSummaryOptions {
    apiKey: string;
    language?: string;
}
export interface YouTubeSummaryResult {
    summary: string;
    transcript: string;
}
export declare class YouTubeHandler {
    private logger;
    private genAI;
    constructor(options: YouTubeSummaryOptions);
    summarizeVideo(url: string, language?: string): Promise<YouTubeSummaryResult>;
}

import { YoutubeTranscript } from 'youtube-transcript';
import { createLogger, format, transports } from 'winston';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface YouTubeSummaryOptions {
    apiKey: string;
    language?: string;
}

export interface YouTubeSummaryResult {
    summary: string;
    transcript: string;
}

export class YouTubeHandler {
    private logger: any;
    private genAI: any;

    constructor(options: YouTubeSummaryOptions) {
        this.logger = createLogger({
            level: 'debug',
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.Console()
            ]
        });

        if (!options.apiKey) {
            throw new Error('YOUTUBE_API_KEY is required');
        }

        this.genAI = new GoogleGenerativeAI(options.apiKey);
    }

    async summarizeVideo(url: string, language: string = 'vi'): Promise<YouTubeSummaryResult> {
        this.logger.info(`Attempting to fetch transcript for URL: ${url}`);

        let fullTextTranscript = '';
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(url);
            this.logger.info('Successfully fetched transcript, length:', transcript.length);

            fullTextTranscript = transcript.map(entry => {
                const minutes = Math.floor(entry.offset / 60000);
                const seconds = Math.floor((entry.offset % 60000) / 1000);
                return `[${minutes}:${seconds.toString().padStart(2, '0')}] ${entry.text}`;
            }).join('\n');

        } catch (error: any) {
            throw new Error(`Failed to fetch transcript: ${error.message}`);
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const prompt = `Hãy tóm tắt nội dung của video YouTube sau đây bằng tiếng ${language}. Video có transcript như sau:\n\n${fullTextTranscript}\n\nHãy tóm tắt các điểm chính và thông tin quan trọng trong video.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const summary = response.text();

            return {
                summary,
                transcript: fullTextTranscript
            };

        } catch (error: any) {
            throw new Error(`Failed to summarize transcript with AI: ${error.message}`);
        }
    }
} 
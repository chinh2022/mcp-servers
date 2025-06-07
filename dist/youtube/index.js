"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeHandler = void 0;
const youtube_transcript_1 = require("youtube-transcript");
const winston_1 = require("winston");
const generative_ai_1 = require("@google/generative-ai");
class YouTubeHandler {
    constructor(options) {
        this.logger = (0, winston_1.createLogger)({
            level: 'debug',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            transports: [
                new winston_1.transports.Console()
            ]
        });
        if (!options.apiKey) {
            throw new Error('YOUTUBE_API_KEY is required');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(options.apiKey);
    }
    async summarizeVideo(url, language = 'vi') {
        this.logger.info(`Attempting to fetch transcript for URL: ${url}`);
        let fullTextTranscript = '';
        try {
            const transcript = await youtube_transcript_1.YoutubeTranscript.fetchTranscript(url);
            this.logger.info('Successfully fetched transcript, length:', transcript.length);
            fullTextTranscript = transcript.map(entry => {
                const minutes = Math.floor(entry.offset / 60000);
                const seconds = Math.floor((entry.offset % 60000) / 1000);
                return `[${minutes}:${seconds.toString().padStart(2, '0')}] ${entry.text}`;
            }).join('\n');
        }
        catch (error) {
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
        }
        catch (error) {
            throw new Error(`Failed to summarize transcript with AI: ${error.message}`);
        }
    }
}
exports.YouTubeHandler = YouTubeHandler;

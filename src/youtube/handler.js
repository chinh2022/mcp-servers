// src/youtube/handler.js
const BaseHandler = require('../base/handler');
const { YoutubeTranscript } = require('youtube-transcript');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class YoutubeHandler extends BaseHandler {
    constructor(config) {
        super(config);
        this.genAI = new GoogleGenerativeAI(config.YOUTUBE_API_KEY);
    }

    async handle(input) {
        try {
            const transcript = await this.getTranscript(input.url);
            const summary = await this.summarize(transcript);
            return this.sendSuccessResponse({ summary });
        } catch (error) {
            return this.sendErrorResponse(error);
        }
    }

    async getTranscript(url) {
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        return transcript.map(entry => entry.text).join(' ');
    }

    async summarize(text) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent(text);
        return result.response.text();
    }
}

module.exports = YoutubeHandler;
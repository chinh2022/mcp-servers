// src/base/handler.js
class BaseHandler {
    constructor(config) {
        this.config = config;
        this.logger = this.setupLogger();
    }

    setupLogger() {
        // Logger setup
    }

    async handle(input) {
        throw new Error('Method not implemented');
    }

    sendSuccessResponse(payload) {
        return {
            success: true,
            data: payload
        };
    }

    sendErrorResponse(error) {
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = BaseHandler;
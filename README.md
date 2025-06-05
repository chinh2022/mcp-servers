# MCP Servers Collection

Collection of MCP servers for various services including YouTube, Google Drive, Figma, and Jira.

## Installation

```bash
npm install mcp-servers
```

## Usage

### YouTube Video Summarization

1. Configure your MCP server in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "summarize-youtube": {
      "command": "node",
      "args": ["./node_modules/mcp-servers/dist/youtube/handler.js"],
      "env": {
        "YOUTUBE_API_KEY": "your-api-key"
      }
    }
  }
}
```

2. Use in your code:

```typescript
import { YouTubeHandler } from 'mcp-servers';

// Initialize the handler
const youtubeHandler = new YouTubeHandler({
  apiKey: process.env.YOUTUBE_API_KEY
});

// Summarize a video
const result = await youtubeHandler.summarizeVideo('https://youtube.com/watch?v=...');
console.log(result.summary);
```

## Available Servers

### YouTube Server
- Video summarization
- Transcript extraction
- Content analysis

### Google Drive Server (Coming Soon)
- File management
- Document processing
- Content organization

### Figma Server (Coming Soon)
- Design export
- Asset management
- Style extraction

### Jira Server (Coming Soon)
- Issue tracking
- Project management
- Workflow automation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
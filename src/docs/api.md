# docs/api.md

## API Documentation

### YouTube Handler

```javascript
const handler = new YoutubeHandler({
    YOUTUBE_API_KEY: 'your-api-key'
});

const result = await handler.handle({
    url: 'https://youtube.com/watch?v=...'
});
```

### Google Drive Handler

```javascript
const handler = new GoogleDriveHandler({
    GOOGLE_DRIVE_CREDENTIALS: 'your-credentials'
});

const result = await handler.handle({
    folderId: 'your-folder-id'
});
```
```

Bạn muốn tôi giải thích chi tiết về phần nào không? Hoặc bạn muốn tôi hướng dẫn cách implement các handlers khác như Figma hoặc Jira?
# IV Animate - Remotion Rendering Service

A TypeScript + Bun-powered service for rendering videos using Remotion with native HTTP server.

## Installation

```bash
bun install
```

Or if you prefer npm:

```bash
npm install
```

## Usage

### Run the HTTP server

```bash
bun start
```

Or with npm:

```bash
npm start
```

This starts a Bun-powered HTTP server on port 3000 with the following endpoints:

- `GET /health` - Health check
- `POST /render` - Render a video from index.tsx content
- `GET /videos` - List all rendered videos
- `GET /download/:filename` - Download a rendered video

### Render videos via API

Send a POST request to `/render` with:

```json
{
  "indexTsx": "// Your complete index.tsx content here",
  "compositionId": "MyComp",
  "outputName": "my-video.mp4",
  "destination_blob": {
    "region": "us-east-1",
    "bucket": "my-videos-bucket",
    "key": "rendered-videos/my-video.mp4"
  }
}
```

**Parameters:**
- `indexTsx` (required): Complete Remotion index.tsx content
- `compositionId` (optional): Composition ID to render (default: "MyComp")
- `outputName` (optional): Output filename
- `inputProps` (optional): Props to pass to the composition
- `codec` (optional): Video codec (default: "h264")
- `destination_blob` (optional): S3 upload destination

**Example with curl:**

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -d '{
    "indexTsx": "import React from '\''react'\''; import { Composition, registerRoot } from '\''remotion'\''; import { AbsoluteFill } from '\''remotion'\''; const MyComp = () => <AbsoluteFill style={{backgroundColor: '\''red'\'', justifyContent: '\''center'\'', alignItems: '\''center'\'', fontSize: '\''4rem'\'', color: '\''white'\''}}>Hello API!</AbsoluteFill>; export const RemotionRoot = () => <Composition id=\"MyComp\" component={MyComp} durationInFrames={90} fps={30} width={1920} height={1080} />; registerRoot(RemotionRoot);",
    "compositionId": "MyComp",
    "outputName": "api-test.mp4"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Video rendered and uploaded to S3 successfully",
  "outputPath": "out/api-test.mp4",
  "outputName": "api-test.mp4",
  "s3Location": "https://my-videos-bucket.s3.us-east-1.amazonaws.com/rendered-videos/my-video.mp4"
}
```

### Other API endpoints

**List all videos:**
```bash
curl http://localhost:3000/videos
```

**Download a video:**
```bash
curl -O http://localhost:3000/download/my-video.mp4
```

### Direct rendering (CLI)

```bash
npm run render
```

This will render the current `src/index.tsx` file to `out/MyComp.mp4`.

### Test Directory (Recommended for Development)

For easier development and testing, use the `test/` directory:

```bash
# Render from test/index.tsx
npm run render:test

# Run with example JSON file
npm run render:local
```

The test directory provides:
- **Full TypeScript files** - Edit `test/index.tsx` with complete component code
- **Instant rendering** - Run `npm run render:test` to render your changes
- **No JSON embedding** - Much easier than putting code in JSON strings
- **Output to `out/test-video.mp4`** - Clean, predictable output location

See `test/README.md` for detailed usage instructions.

### TypeScript Development

```bash
# Type check without compilation
npm run type-check

# Build TypeScript (optional - Bun runs .ts files directly)
npm run build
```

### Development

To preview compositions in the Remotion Studio:

```bash
npm run dev
```

## File Structure

- `src/index.tsx` - Main entry point that registers the Remotion root
- `src/MyComp.tsx` - Example composition component
- `src/render.ts` - Main rendering script with TypeScript types
- `src/server.ts` - HTTP server with full TypeScript support
- `src/utils/s3.ts` - S3 upload utilities
- `src/fallback/` - Fallback composition for testing
- `test/index.tsx` - **Test composition for development** 
- `test/README.md` - Test directory documentation
- `scripts/render-test.ts` - Script to render from test directory
- `example-local-request.json` - Example JSON request for local rendering
- `tsconfig.json` - TypeScript configuration
- `out/` - Directory where rendered videos are saved

## Customization

### Modify the composition

Edit `src/MyComp.tsx` to change the visual content of your video.

### Add new compositions

1. Create a new component in the `src/` directory
2. Add it to `src/index.tsx` with a new `<Composition>` tag
3. Update the `id` in `render.mjs` to match your new composition

### Change render parameters

Edit `render.mjs` to modify:
- Output codec
- Input props
- Output location
- Chromium options

## Docker

Build and run with Docker:

```bash
docker build -t iv-animate .
docker run -v $(pwd)/out:/app/out iv-animate
```

The rendered video will be available in the `out/` directory on your host machine.

## S3 Upload Configuration

To use S3 upload functionality, configure AWS credentials via environment variables:

```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_SESSION_TOKEN=your_session_token  # Optional, for temporary credentials
```

Or use IAM roles when running in AWS (recommended for production).

The service will upload videos to S3 when `destination_blob` is provided in the render request.

## Why Bun?

This service uses Bun instead of Node.js + Express for several performance benefits:

- **Faster startup**: Bun starts ~4x faster than Node.js
- **Lower memory usage**: Bun uses significantly less memory than Node.js
- **Native HTTP server**: No need for Express - Bun has built-in HTTP server with routing
- **Better performance**: Faster JSON parsing and HTTP handling
- **Same API**: Drop-in replacement for Node.js with better performance

The server uses Bun's native `fetch` API and `Response` objects for clean, modern HTTP handling.

## TypeScript Benefits

This service is built with full TypeScript support for enhanced development experience:

- **Type Safety**: Full type checking for API requests, responses, and Remotion configurations
- **IntelliSense**: Rich autocomplete and documentation in your IDE
- **Interface Definitions**: Clear contracts for render requests and responses
- **Error Prevention**: Catch type errors at compile time instead of runtime
- **Better Refactoring**: Safe code changes with confidence
- **Self-Documenting**: Types serve as inline documentation

Key TypeScript features:
- Typed render request bodies with `RenderRequestBody` interface
- Strongly typed API responses with `ApiResponse` interface
- Typed Remotion options with `RenderVideoOptions` interface
- Bun-specific types for file handling and HTTP responses 
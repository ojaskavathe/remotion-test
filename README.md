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

This starts a Bun-powered HTTP server on port 4444 with the following endpoints:

- `GET /health` - Health check
- `POST /remotion/generate` - Render a video from React/Remotion code (local output or S3 upload)

### Render videos via API

Send a POST request to `/remotion/generate` with:

```json
{
  "code": "// Your complete Remotion React code here",
  "destination_blob": {
    "region": "us-east-1",
    "bucket": "my-videos-bucket",
    "key": "rendered-videos/my-video.mp4"
  }
}
```

**Parameters:**
- `code` (required): Complete Remotion React component code with composition registration
- `destination_blob` (optional): S3 upload destination. **If omitted, video renders locally to `/out` directory only.**

### Local-Only Rendering (No S3)

To render videos locally without S3 upload, simply omit the `destination_blob` parameter:

```bash
curl -X POST http://localhost:4444/remotion/generate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import React from '\''react'\''; import { Composition, registerRoot, AbsoluteFill } from '\''remotion'\''; const MyComp = () => <AbsoluteFill style={{backgroundColor: '\''green'\'', justifyContent: '\''center'\'', alignItems: '\''center'\'', fontSize: '\''4rem'\'', color: '\''white'\''}}>Local Render!</AbsoluteFill>; export const RemotionRoot = () => <Composition id=\"MyComp\" component={MyComp} durationInFrames={90} fps={30} width={1920} height={1080} />; registerRoot(RemotionRoot);"
  }'
```

**Local Response:**
```json
{
  "success": true,
  "message": "Video rendered successfully",
  "outputPath": "out/MyComp-1752823308746-ac1d5thl31.mp4",
  "outputName": "MyComp-1752823308746-ac1d5thl31.mp4"
}
```

The video file will be saved in the `out/` directory with a unique timestamp-based filename.

### S3 Upload + Local Rendering

**Example with curl:**

```bash
curl -X POST http://localhost:4444/remotion/generate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import React from '\''react'\''; import { Composition, registerRoot } from '\''remotion'\''; import { AbsoluteFill } from '\''remotion'\''; const MyComp = () => <AbsoluteFill style={{backgroundColor: '\''red'\'', justifyContent: '\''center'\'', alignItems: '\''center'\'', fontSize: '\''4rem'\'', color: '\''white'\''}}>Hello API!</AbsoluteFill>; export const RemotionRoot = () => <Composition id=\"MyComp\" component={MyComp} durationInFrames={90} fps={30} width={1920} height={1080} />; registerRoot(RemotionRoot);"
  }'
```

**S3 Response:**

```json
{
  "success": true,
  "message": "Video rendered and uploaded to S3 successfully",
  "outputPath": "out/MyComp-1234567890-abc123.mp4",
  "outputName": "MyComp-1234567890-abc123.mp4",
  "s3Location": "https://my-videos-bucket.s3.us-east-1.amazonaws.com/rendered-videos/my-video.mp4"
}
```

### Local Development Workflows

#### Test Directory (Recommended for Development)

For easier development and testing, use the `test/` directory:

```bash
# Render from test/index.tsx
npm run render:test
# or
bun scripts/render-test.ts
```

The test directory provides:
- **Full TypeScript files** - Edit `test/index.tsx` with complete component code
- **Instant rendering** - Run `npm run render:test` to render your changes
- **No JSON embedding** - Much easier than putting code in JSON strings
- **Output to `out/test-video.mp4`** - Clean, predictable output location

See `test/README.md` for detailed usage instructions.

#### JSON Request Testing

Test with example JSON files:

```bash
# Run with example JSON file (processes example-local-request.json)
npm run render:local
# or
bun scripts/render-local.ts
```

This processes the code from `example-local-request.json` and renders it locally.

#### Example Files

- `example-local-request.json` - Local rendering example with potato farming animation
- `example-s3-request.json` - S3 upload example for testing cloud functionality

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

## Testing

### Automated Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test
# or
bun test

# Run specific render tests
npm run test:render
# or
bun test src/render.test.ts
```

**Test Coverage:**
- Video rendering with default options
- Custom output names and paths
- Input props handling
- Different codec support (h264, h265, etc.)
- Error handling for invalid entry points
- Error handling for invalid composition IDs
- Performance testing with 60-second timeouts

### Manual Testing

The test suite includes comprehensive integration tests that:
- Render actual video files using the fallback composition
- Verify file creation and output paths
- Test error scenarios and edge cases
- Support multiple video codecs
- Include proper timeout handling for video rendering

## File Structure

```
src/
├── server.ts              # HTTP server with Bun native routing
├── render.ts              # Core video rendering functionality
├── render.test.ts         # Comprehensive test suite
├── utils/
│   └── s3.ts             # AWS S3 upload utilities
└── fallback/
    ├── index.tsx         # Fallback composition for testing
    └── MyComp.tsx        # Example TypeScript component

test/
├── index.tsx             # Development composition for testing
├── list.tsx              # Example list animation
├── strikethrough.tsx     # Example text effects
└── README.md             # Test directory documentation

scripts/
├── render-test.ts        # Script to render from test directory
└── render-local.ts       # Script to render from JSON files

prompts/                  # Animation prompt examples
├── list.md
├── pixar.md
└── strikethrough.md

example-local-request.json    # Local rendering example
example-s3-request.json       # S3 upload example
```

## Customization

### Modify compositions

1. **For development**: Edit `test/index.tsx` and run `npm run render:test`
2. **For production API**: Send your code via the `/remotion/generate` endpoint
3. **For testing**: Modify the fallback composition in `src/fallback/`

### Video parameters

The service automatically handles:
- Unique output filenames (timestamp + random ID)
- Temporary file cleanup
- Error handling and rollback
- Composition detection and validation

### Supported codecs

- `h264` (default)
- `h265`
- `vp8`
- `vp9`
- `mp3`
- `aac`
- `wav`
- `prores`
- `gif`

## Docker

Build and run with Docker:

```bash
docker build -t iv-animate .
docker run -p 4444:4444 -v $(pwd)/out:/app/out iv-animate
```

The service will be available at `http://localhost:4444` and rendered videos will be available in the `out/` directory on your host machine.

**Docker features:**
- Chrome/Chromium dependencies pre-installed
- Optimized for video rendering
- Volume mounting for output files
- Proper port exposure

## S3 Upload Configuration

Configure AWS credentials via environment variables:

```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_SESSION_TOKEN=your_session_token  # Optional, for temporary credentials
```

Or use IAM roles when running in AWS (recommended for production).

**S3 Upload Features:**
- Automatic content type detection (`video/mp4`)
- Proper error handling and rollback
- URL generation for uploaded files
- Validation of S3 configuration
- Supports all AWS regions

## Development Environment

### Nix Support

This project includes a Nix flake for reproducible development environments:

```bash
# Enter development shell
nix develop

# Or use direnv
echo "use flake" > .envrc
direnv allow
```

**Included tools:**
- Node.js 22
- Bun runtime
- PNPM package manager
- Prettier (in non-CI environments)

### TypeScript Configuration

Full TypeScript support with:
- ES2022 target with DOM and modern JS features
- React JSX transform
- Strict type checking
- Bun-specific types
- Import of TypeScript extensions

## API Reference

### POST /remotion/generate

**Request Body:**
```typescript
interface RenderRequestBody {
  code: string;              // Complete Remotion React code
  destination_blob?: {       // Optional S3 upload
    region: string;
    bucket: string;
    key: string;
  };
}
```

**Response:**
```typescript
interface ApiResponse {
  success: boolean;
  message: string;
  outputPath: string;        // Local file path
  outputName: string;        // Generated filename
  s3Location?: string;       // S3 URL if uploaded
}
```

### GET /health

Returns service status and availability.

## Performance & Reliability

**Features:**
- Automatic temporary file cleanup
- Unique filename generation to prevent conflicts
- Comprehensive error handling with rollback
- Memory-efficient video rendering
- Support for large video files
- Timeout handling for long renders

**Why Bun?**
- **4x faster startup** than Node.js
- **Lower memory usage** for video processing
- **Native HTTP server** - no Express overhead
- **Better JSON parsing** performance
- **Same APIs** as Node.js with better performance
- **Built-in testing** framework

## TypeScript Benefits

**Enhanced Development Experience:**
- Full type safety for API requests and responses
- IntelliSense support for Remotion components
- Compile-time error detection
- Self-documenting interfaces
- Safe refactoring capabilities

**Key Type Definitions:**
- `RenderRequestBody` - API request validation
- `RenderVideoOptions` - Rendering configuration
- `S3Blob` - Cloud upload settings
- `ApiResponse` - Structured API responses

## Examples

### Local-Only Rendering
```bash
# Render to local /out directory only
curl -X POST http://localhost:4444/remotion/generate \
  -H "Content-Type: application/json" \
  -d '{"code": "import React from \"react\"; import { Composition, registerRoot, AbsoluteFill } from \"remotion\"; const MyComp = () => <AbsoluteFill style={{backgroundColor: \"purple\", justifyContent: \"center\", alignItems: \"center\", fontSize: \"4rem\", color: \"white\"}}>Local Video!</AbsoluteFill>; export const RemotionRoot = () => <Composition id=\"MyComp\" component={MyComp} durationInFrames={60} fps={30} width={1920} height={1080} />; registerRoot(RemotionRoot);"}'

# Response: {"success":true,"message":"Video rendered successfully","outputPath":"out/MyComp-123456789-abc123.mp4","outputName":"MyComp-123456789-abc123.mp4"}
```

### Basic Animation
```typescript
import React from 'react';
import { Composition, registerRoot, AbsoluteFill, useCurrentFrame } from 'remotion';

const MyComp = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      backgroundColor: 'blue',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '4rem',
      color: 'white'
    }}>
      Frame {frame}
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <Composition 
    id="MyComp" 
    component={MyComp} 
    durationInFrames={90} 
    fps={30} 
    width={1920} 
    height={1080} 
  />
);

registerRoot(RemotionRoot);
```

### Advanced Animation
See `test/index.tsx` for a complete logo reveal animation with:
- Scale animations with easing
- Clip-path reveal effects
- Opacity transitions
- External asset loading

### List Animations
See `test/list.tsx` for animated list items with:
- Spring-based entrance animations
- Staggered timing
- Color coordination
- Responsive positioning

## Troubleshooting

**Common Issues:**
1. **Port conflicts**: Service runs on port 4444 (configurable via PORT env var)
2. **Missing compositions**: Ensure your code includes `registerRoot()` call
3. **S3 upload failures**: Check AWS credentials and bucket permissions
4. **Render timeouts**: Large videos may need extended timeouts
5. **Memory issues**: Monitor available RAM for high-resolution renders

**Debug Mode:**
Set environment variables for detailed logging:
```bash
export DEBUG=1
export VERBOSE=1
``` 
import fs from 'fs/promises';
import path from 'path';
import { renderVideo, type RenderVideoOptions } from './render';
import { uploadToS3, validateS3Blob, type S3Blob } from './utils/s3';

const PORT = process.env.PORT || 4444;
const DEFAULT_COMPOSITION_NAME = 'MyComp';

interface RenderRequestBody {
  code: string;
  destination_blob?: S3Blob;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  outputPath?: string;
  outputName?: string;
  s3Location?: string;
  error?: string;
  details?: string;
  status?: string;
  videos?: string[];
}

interface HealthResponse {
  status: 'ok';
  message: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

async function parseJSON(req: Request): Promise<RenderRequestBody | null> {
  try {
    return await req.json();
  } catch (error) {
    return null;
  }
}

function jsonResponse(data: ApiResponse | HealthResponse | ErrorResponse, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function router(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  console.log(`${method} ${pathname}`);

  // Health check endpoint
  if (method === 'GET' && pathname === '/health') {
    return jsonResponse({ 
      status: 'ok', 
      message: 'Remotion rendering service is running' 
    });
  }

  // Render endpoint
  if (method === 'POST' && pathname === '/remotion/generate') {
    try {
      const body = await parseJSON(req);
      
      if (!body || !body.code) {
        return jsonResponse({ error: 'Missing code content' }, 400);
      }

      const { code, destination_blob } = body;
      const compositionId = DEFAULT_COMPOSITION_NAME;
      const outputName = undefined;
      const inputProps = {};
      const codec = 'h264';

      // Validate destination_blob if provided
      if (destination_blob && !validateS3Blob(destination_blob)) {
        return jsonResponse({ 
          error: 'Invalid destination_blob format. Must contain region, bucket, and key strings.' 
        }, 400);
      }

      // Generate unique filename to avoid conflicts
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 15);
      const tempIndexPath = path.resolve(`src/index-${timestamp}-${uniqueId}.tsx`);
      const finalOutputName = outputName || `${compositionId}-${timestamp}-${uniqueId}.mp4`;

              console.log(`Starting render for composition: ${compositionId}`);
        console.log(`Using temporary index file: ${tempIndexPath}`);
        console.log(`Output file: ${finalOutputName}`);
        if (destination_blob) {
          console.log(`Will upload to S3: ${destination_blob.bucket}/${destination_blob.key}`);
        }

        // Write the received index.tsx content to a temporary file
        await fs.writeFile(tempIndexPath, code);

      try {
        // Render the video using the temporary index file
        const outputPath = await renderVideo({
          entryPoint: tempIndexPath,
          compositionId,
          outputName: finalOutputName,
          inputProps,
          codec
        } as RenderVideoOptions);

        // Clean up temporary file
        await fs.unlink(tempIndexPath);

        // Upload to S3 if destination_blob is provided
        let s3Location: string | undefined;
        if (destination_blob) {
          console.log('Uploading to S3...');
          const uploadResult = await uploadToS3(outputPath, destination_blob);
          
          if (uploadResult.success) {
            s3Location = uploadResult.location;
            console.log(`Successfully uploaded to S3: ${s3Location}`);
          } else {
            console.error('S3 upload failed:', uploadResult.error);
            return jsonResponse({ 
              error: 'Video rendered but S3 upload failed',
              details: uploadResult.error,
              outputPath: outputPath,
              outputName: finalOutputName
            }, 500);
          }
        }

        return jsonResponse({ 
          success: true, 
          message: destination_blob ? 'Video rendered and uploaded to S3 successfully' : 'Video rendered successfully',
          outputPath: outputPath,
          outputName: finalOutputName,
          ...(s3Location && { s3Location })
        });

      } catch (renderError) {
        // Clean up temporary file even if rendering fails
        try {
          await fs.unlink(tempIndexPath);
        } catch (cleanupError) {
          console.error('Error cleaning up temporary file:', cleanupError);
        }
        throw renderError;
      }

    } catch (error) {
      console.error('Render error:', error);
      return jsonResponse({ 
        error: 'Failed to render video',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  }

  // 404 for unmatched routes
  return jsonResponse({ error: 'Route not found' }, 404);
}

// Start the server
const server = Bun.serve({
  port: PORT,
  fetch: router,
});

console.log(`Remotion rendering service listening on port ${PORT}`);
console.log(`Health check: http://localhost:${PORT}/health`);
console.log(`Render endpoint: POST http://localhost:${PORT}/remotion/generate`);
console.log(`Server: http://localhost:${PORT}`); 
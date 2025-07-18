#!/usr/bin/env bun
import { renderVideo } from '../src/render';
import { readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';

interface LocalRequest {
  code: string;
  destination_blob?: {
    region: string;
    bucket: string;
    key: string;
  };
}

async function main() {
  try {
    // Read the example request
    const requestFile = await readFile('example-local-request.json', 'utf-8');
    const request: LocalRequest = JSON.parse(requestFile);
    
    console.log('Processing local render request...');
    
    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const tempIndexPath = join('src', `index-${timestamp}-${uniqueId}.tsx`);
    
    // Write the index.tsx content to a temporary file
    await writeFile(tempIndexPath, request.code);
    
    console.log(`Created temporary index file: ${tempIndexPath}`);
    console.log(`Rendering composition: MyComp`);
    
    // Render the video
    const outputPath = await renderVideo({
      entryPoint: tempIndexPath,
      compositionId: 'MyComp',
      outputName: undefined,
      inputProps: {},
      codec: 'h264'
    });
    
    // Clean up temporary file
    await unlink(tempIndexPath);
    
    console.log(`✅ Video rendered successfully: ${outputPath}`);
    console.log(`🎬 You can find your video at: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error rendering video:', error);
    process.exit(1);
  }
}

main(); 
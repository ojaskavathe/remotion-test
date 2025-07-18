#!/usr/bin/env bun
import { renderVideo } from '../src/render';
import path from 'path';

async function main() {
  try {
    console.log('🎬 Rendering from test/index.tsx...');
    
    const outputPath = await renderVideo({
      entryPoint: path.resolve('test/index.tsx'),
      compositionId: 'MyComp',
      outputName: 'test-video.mp4',
      codec: 'h264'
    });
    
    console.log(`✅ Video rendered successfully: ${outputPath}`);
    console.log(`🎭 You can find your video at: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error rendering video:', error);
    process.exit(1);
  }
}

main(); 
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { createRequire } from 'node:module';
import path from 'path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface RenderVideoOptions {
  entryPoint: string;
  compositionId?: string;
  outputName?: string;
  inputProps?: Record<string, unknown>;
  codec?: 'h264' | 'h265' | 'vp8' | 'vp9' | 'mp3' | 'aac' | 'wav' | 'prores' | 'gif';
}

export async function renderVideo({
  entryPoint,
  compositionId = 'MyComp',
  outputName,
  inputProps = {},
  codec = 'h264'
}: RenderVideoOptions): Promise<string> {
  // Convert to absolute path if it's relative
  const absoluteEntryPoint = path.isAbsolute(entryPoint) 
    ? entryPoint 
    : path.resolve(__dirname, entryPoint);
    
  const bundled = await bundle({
    entryPoint: absoluteEntryPoint,
    // If you have a webpack override in remotion.config.ts, pass it here as well.
    webpackOverride: (config) => config,
  });
 
  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps,
  });
 
  console.log('Starting to render composition');
 
  const outputLocation = `out/${outputName || `${composition.id}.mp4`}`;
 
  await renderMedia({
    codec,
    composition,
    serveUrl: bundled,
    outputLocation,
    chromiumOptions: {
      enableMultiProcessOnLinux: true,
    },
    inputProps,
  });
 
  console.log(`Rendered composition ${composition.id}.`);
  return outputLocation;
}
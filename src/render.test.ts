import { expect, test, describe } from 'bun:test';
import { renderVideo } from './render';
import { existsSync } from 'fs';
import path from 'path';

describe('renderVideo', () => {
  test('should render video successfully with default options', async () => {
    const outputPath = await renderVideo({
      entryPoint: './fallback/index.tsx',
      compositionId: 'MyComp'
    });
    
    // Check that the function returns a path
    expect(outputPath).toBeDefined();
    expect(typeof outputPath).toBe('string');
    expect(outputPath).toMatch(/\.mp4$/);
    
    // Check that the output file was created
    const fullPath = path.resolve(outputPath);
    expect(existsSync(fullPath)).toBe(true);
  }, 60000); // 60 second timeout for video rendering

  test('should render video with custom output name', async () => {
    const customName = 'custom-test-video.mp4';
    const outputPath = await renderVideo({
      entryPoint: './fallback/index.tsx',
      compositionId: 'MyComp',
      outputName: customName
    });
    
    expect(outputPath).toBe(`out/${customName}`);
    expect(existsSync(path.resolve(outputPath))).toBe(true);
  }, 60000);

  test('should render video with custom input props', async () => {
    const inputProps = {
      title: 'Test Video',
      duration: 30
    };
    
    const outputPath = await renderVideo({
      entryPoint: './fallback/index.tsx',
      compositionId: 'MyComp',
      inputProps,
      outputName: 'props-test.mp4'
    });
    
    expect(outputPath).toBeDefined();
    expect(existsSync(path.resolve(outputPath))).toBe(true);
  }, 60000);

  test('should handle different codecs', async () => {
    const outputPath = await renderVideo({
      entryPoint: './fallback/index.tsx',
      compositionId: 'MyComp',
      codec: 'h265',
      outputName: 'h265-test.mp4'
    });
    
    expect(outputPath).toBeDefined();
    expect(existsSync(path.resolve(outputPath))).toBe(true);
  }, 60000);

  test('should throw error for invalid entry point', async () => {
    await expect(renderVideo({
      entryPoint: './non-existent-file.tsx',
      compositionId: 'MyComp'
    })).rejects.toThrow();
  });

  test('should throw error for invalid composition ID', async () => {
    await expect(renderVideo({
      entryPoint: './fallback/index.tsx',
      compositionId: 'NonExistentComp'
    })).rejects.toThrow();
  });
}); 
# Test Directory

This directory is for testing your Remotion components with full TypeScript files.

## How to Use

1. **Edit `test/index.tsx`** - Put your complete Remotion component code here
2. **Run the test** - Use `npm run render:test` to render your video
3. **Check the output** - Your video will be saved as `out/test-video.mp4`

## Commands

```bash
# Render from test/index.tsx
npm run render:test

# Preview in Remotion Studio (points to test directory)
npm run dev

# Or run directly
bun scripts/render-test.ts
```

## File Structure

- `test/index.tsx` - Your full Remotion component
- `out/test-video.mp4` - The rendered output

## Tips

- Make sure your composition ID matches what's expected (currently "GeneratedVideo")
- You can modify the script in `scripts/render-test.ts` to change output settings
- This is much easier than embedding code in JSON files!

## Example Usage

The current `test/index.tsx` contains the potato farming animation. You can:
1. Edit the text, colors, timings, or add new animations
2. Run `npm run render:test` 
3. Check `out/test-video.mp4` to see your changes

Happy animating! 🎬 
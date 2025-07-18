import React from 'react';
import {
	AbsoluteFill,
	Composition,
	registerRoot,
	Img,
	useCurrentFrame,
	interpolate,
	Easing,
} from 'remotion';

// The background color is sampled from the provided logo image.
const BACKGROUND_COLOR = '#EADBCD';

// The path to the logo asset as specified in the prompt.
const LOGO_ASSET_PATH = 'https://iv-prod-pro-uploads.s3.amazonaws.com/crawled/e7d3684a75e5e89e375ae291142bbf581d4ecd943f557f65a8906ec65b9cc8bc/medias/955a2d6a2885a476aea1835977da00bd08d1f31e30a65b6b789c185690e1814c/955a2d6a2885a476aea1835977da00bd08d1f31e30a65b6b789c185690e1814c?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAYPWI4T73CF2TCA2B%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T101407Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBMaCXVzLWVhc3QtMSJIMEYCIQC0YZcMpSR4CKRzs0pyJj1SPzywTkIuZwvfEc3b3P9MQAIhANbAF6jDb2b5FIdePq7eVcgc1KRAbNMNz5IWuiuO3JxsKvMECCsQBBoMNTgzNDYzMTE2NzkwIgzFM5Y0debc8TweWCAq0ASwins2t71S%2FDgB3Q6Ock2VdsoTzapIn%2FHhIPVEhXW917mrrt5HxrrwD248Azx4uVaOrOMaWZ4ATX8sKMLfeYvZoL10Ec64pK4jbInqEsESxAbHr0xnz3aY8alHu0eb1tZhzqc621yZVNSO6N3ju%2FQ7fw7Atq9E76hb12MzZGNTV1hTWONVo8%2FZT2YATjxNPsaOf0dE%2BDEfpRGXr5gugtlyQofhpInl6DuJuQYOiUPBfG0OhnEOOkrSz%2BF4ZELrI5K7Oa71wNNAiIof0th8Wn%2FZ4W6byy6RGbG1jQQECaiZwp8Rj7DwYFSWs4HFVCKe2a8u%2F%2F3N0HoCjGclZlgrS3b%2FFGZ7KyFclcA5%2Bz1%2BqXwXTHfuHvJbxtIPVzY5H3AXwcfN90RzCTC8flfBs87S%2BJBkKSrbiF9pMLW2aVwgj8KLpI3wCdFz1xXDORDfMda28QNIQ1SykQfS%2BvKjH9o5wHFm0OPPJqlljf%2B9esgNlbOMcKfVgR%2FA5YUAp9zDp9monHnoC80%2BcdpgRRsdqpG0AaZadAjza%2FbY3Hoeu7PHsyxWUyHnsUnR7U%2F7er2jQgO%2FwxZ1o50pwwQxHR3530glz2s1MqkatVEjgkJPM6iYRM5%2BuQ0jWG7O2V6nARKBGzaNq8raX7E%2F0v0w35w1Fesc7I5vS56QRTXLCdaP61fpPoW%2FQNiN26%2Bp4W4kK%2FlGNtH6Pv7HVU6d7z5CmdDRmMDuZhNZoqlpe%2FY3AUfQUbCaYhIxcodG4UJyAurT8f5EgvUyhcVHlfp3JdD%2FVSG5G%2Frszk25MOOw08MGOpkB2olVCB%2BYPOK62aiYED2voIxQ5uO2621bB6911N11qHvNboVx5oakBJpjw5szZ2eywzFgrIJTcqxeyFDh4fXwpKIjhUtAYRJuWyLx3EzcCKbsJNpH4rwepDE%2B%2BwPVcfVvZo8BztJlBdutEEkbu4pDFLynV7yfB1CZONXeeqzBjIDJn4v9xLfvLyDGNtKuV%2F%2FArqMjd24uylYx&X-Amz-SignedHeaders=host&X-Amz-Signature=eebd4dbb17c7f3d005e46325a14a4521867cfb210ad24a5d944b916d101c4b18';

const LogoReveal: React.FC = () => {
	const frame = useCurrentFrame();

	// Animation 1: A subtle scale-down effect to make the logo "settle" in place.
	// It animates from a scale of 1.1 down to 1 over 60 frames.
	const scale = interpolate(frame, [0, 60], [1.1, 1], {
		easing: Easing.out(Easing.quad),
		extrapolateRight: 'clamp',
	});

	// Animation 2: A reveal effect using clip-path.
	// This creates a "wipe" from top to bottom, revealing the logo smoothly.
	// The animation starts at frame 10 and ends at frame 70.
	const revealProgress = interpolate(frame, [10, 70], [100, 0], {
		easing: Easing.inOut(Easing.cubic),
		extrapolateRight: 'clamp',
	});

	// Animation 3: A fade-in effect to prevent the logo from appearing abruptly.
	const opacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					opacity: opacity,
					// The clipPath reveals the content from top to bottom.
					clipPath: `inset(0 0 ${revealProgress}% 0)`,
				}}
			>
				<Img
					src={LOGO_ASSET_PATH}
					style={{
						// Assuming the logo asset itself has a good resolution,
						// we can set a width and let the height be auto to maintain aspect ratio.
						width: 800,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

const MyComp: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: BACKGROUND_COLOR }}>
			<LogoReveal />
		</AbsoluteFill>
	);
};

const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={120} // 4 seconds total duration
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};

registerRoot(Root);
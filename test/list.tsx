import {
	AbsoluteFill,
	Composition,
	registerRoot,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
} from 'remotion';
import React from 'react';

// The list of items to animate
const items: string[] = [
	'High unemployment',
	'Stagnant economic output',
	'An ageing population',
	'Uncompetitive industries',
	'Low tax revenues',
	'High debt',
	'Increasing interest payments on the debt',
];

// A list of distinct background colors for each item
const backgroundColors: string[] = [
	'#3498db',
	'#e74c3c',
	'#f1c40f',
	'#2ecc71',
	'#9b59b6',
	'#e67e22',
	'#1abc9c',
];

const textStyle: React.CSSProperties = {
	color: 'white',
	fontSize: '55px',
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
	fontWeight: 'bold',
	textAlign: 'left',
};

const itemContainerStyle: React.CSSProperties = {
	padding: '15px 30px',
	borderRadius: '12px',
	display: 'inline-block', // To make the background fit the text
	whiteSpace: 'nowrap', // Prevent text from wrapping
	boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
};

// This component renders a single animated list item
const AnimatedItem: React.FC<{
	text: string;
	backgroundColor: string;
	top: number;
}> = ({text, backgroundColor, top}) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	// Animate the entrance using a spring for a natural bounce
	const progress = spring({
		frame,
		fps,
		config: {
			damping: 100,
			stiffness: 120,
		},
	});

	// Interpolate the spring value to a translateX position
	// It starts from off-screen left and moves to its final position 100px from the left edge
	const translateX = interpolate(progress, [0, 1], [-width, 100]);

	return (
		<div
			style={{
				...itemContainerStyle,
				position: 'absolute',
				top: `${top}px`,
				backgroundColor,
				transform: `translateX(${translateX}px)`,
			}}
		>
			<span style={textStyle}>{text}</span>
		</div>
	);
};

// Main component that orchestrates the animation of all items
export const MyComp: React.FC = () => {
	const {height, durationInFrames} = useVideoConfig();

	// Calculate the vertical positioning to center the block of items
	const itemHeightWithMargin = 110; // (55 fontSize) + (15*2 padding) + 25 margin
	const totalItemsHeight = items.length * itemHeightWithMargin;
	const startY = (height - totalItemsHeight) / 2;

	const delayBetweenItemsInFrames = 1.5 * 30; // 1.5 seconds at 30fps

	return (
		<AbsoluteFill style={{backgroundColor: 'transparent'}}>
			{items.map((text, index) => {
				const sequenceStartFrame = index * delayBetweenItemsInFrames;
				return (
					<Sequence
						key={text}
						from={sequenceStartFrame}
						// Ensure the item stays on screen until the end of the composition
						durationInFrames={durationInFrames - sequenceStartFrame}
					>
						<AnimatedItem
							text={text}
							backgroundColor={backgroundColors[index % backgroundColors.length]}
							top={startY + index * itemHeightWithMargin}
						/>
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};

const Root: React.FC = () => {
	// Calculate the total duration needed for the animation
	const delayBetweenItems = 1.5 * 30; // 45 frames
	const animationInDuration = 1.5 * 30; // 45 frames
	const finalHoldDuration = 3 * 30; // 90 frames

	const totalDurationInFrames =
		(items.length - 1) * delayBetweenItems +
		animationInDuration +
		finalHoldDuration;

	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={Math.ceil(totalDurationInFrames)}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};

registerRoot(Root);
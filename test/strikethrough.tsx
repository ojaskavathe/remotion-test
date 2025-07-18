import {
	AbsoluteFill,
	Composition,
	interpolate,
	registerRoot,
	useCurrentFrame,
} from 'remotion';
import React from 'react';

const MyComp: React.FC = () => {
	const frame = useCurrentFrame();

	// Animate the width of the strikethrough line
	// Start at frame 20, end at frame 50
	const lineWidth = interpolate(frame, [20, 50], [0, 100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					position: 'relative',
					display: 'inline-block',
				}}
			>
				<span
					style={{
						fontSize: 180,
						fontWeight: 'bold',
						fontFamily: 'Helvetica, Arial, sans-serif',
						color: 'white',
						textShadow: '0 0 20px rgba(0,0,0,0.7)',
					}}
				>
					Rewrite
				</span>
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: 0,
						height: 12,
						backgroundColor: '#E53E3E', // A nice shade of red
						width: `${lineWidth}%`,
						boxShadow: '0 0 15px #E53E3E',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={90}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{}}
			/>
		</>
	);
};

registerRoot(Root);
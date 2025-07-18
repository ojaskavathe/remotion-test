import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MyCompProps {
  titleText?: string;
  titleColor?: string;
}

export const MyComp: React.FC<MyCompProps> = ({ 
  titleText = 'TypeScript Remotion!', 
  titleColor = 'blue' 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontSize: '4rem',
          color: titleColor,
          fontFamily: 'Arial, sans-serif',
          transform: `scale(${1 + Math.sin(frame / 10) * 0.1})`,
        }}
      >
        {titleText}
      </div>
    </AbsoluteFill>
  );
}; 
import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { MyComp } from './MyComp';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComp}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: 'TypeScript Remotion!',
          titleColor: 'blue',
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot); 
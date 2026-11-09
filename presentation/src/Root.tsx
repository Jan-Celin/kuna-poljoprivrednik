import {Composition} from 'remotion';
import {pitchDuration, Walkthrough} from './Walkthrough';

export const Root = () => {
  return (
    <Composition
      id="KunaPitch"
      component={Walkthrough}
      durationInFrames={pitchDuration}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

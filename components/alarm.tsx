import React, { Dispatch, SetStateAction } from 'react';
import Sound from 'react-sound';

export type SoundStatus = 'PLAYING' | 'STOPPED' | 'PAUSED';
interface AlarmProps {
  url: string;
  soundStatus: SoundStatus;
  setSoundStatus: Dispatch<SetStateAction<SoundStatus>>;
}
// eslint-disable-next-line react/prop-types
const AlarmComponent: React.FC<AlarmProps> = ({
  url,
  soundStatus,
}) => {
  return (
    <Sound
      url={url}
      playStatus={soundStatus}
      playFromPosition={0 /* in milliseconds */}
      // onLoading={() => { console.log('Alarm loading') }}
      // onPlaying={() => { console.log('Alarm playing') }}
      // onFinishedPlaying={() => { console.log('Alarm finished playing') }}
    />
  );
};

export default React.memo(AlarmComponent);

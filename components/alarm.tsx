/* eslint-disable react/prop-types */
import React, { Dispatch, SetStateAction } from 'react';
import Sound from 'react-sound';

export type SoundStatus = 'PLAYING' | 'STOPPED' | 'PAUSED';
export const IntermediateVolume = 30;
export const FinalVolume = 60;
export type SoundVolume = 30 | 60;
interface AlarmProps {
  url: string;
  soundStatus: SoundStatus;
  soundVolume: SoundVolume;
  setSoundStatus: Dispatch<SetStateAction<SoundStatus>>;
}
// eslint-disable-next-line react/prop-types
const AlarmComponent: React.FC<AlarmProps> = ({
  url,
  soundStatus,
  soundVolume,
}) => {
  return (
    <Sound
      url={url}
      playStatus={soundStatus}
      playFromPosition={0 /* in milliseconds */}
      volume={soundVolume}
      // onLoading={() => { console.log('Alarm loading') }}
      // onPlaying={() => { console.log('Alarm playing') }}
      // onFinishedPlaying={() => { console.log('Alarm finished playing') }}
    />
  );
};

export default React.memo(AlarmComponent);

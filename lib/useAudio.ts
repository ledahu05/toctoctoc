import { useState, useEffect } from 'react';

const useAudio = (url: string): [boolean, () => void] => {
  if (typeof window === 'undefined') return [false, () => {}];
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    console.log('toggling audio from playing', playing);
    setPlaying(!playing);
  };

  useEffect(() => {
    console.log('playing status was updated', playing);
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

export default useAudio;

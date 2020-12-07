import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useLock = () => {
  useEffect(async () => {
    if (navigator && 'wakeLock' in navigator) {
      // The wake lock sentinel.
      let wakeLock = null;

      // Function that attempts to request a screen wake lock.
      const requestWakeLock = async () => {
        try {
          console.log('useLock 1', navigator.wakeLock);
          wakeLock = await navigator.wakeLock.request('screen');
          console.log('wakeLock', wakeLock);
          wakeLock.addEventListener('release', () => {
            console.log(
              'Screen Wake Lock released:',
              wakeLock.released,
            );
          });
          console.log(
            'Screen Wake Lock released:',
            wakeLock.released,
          );
        } catch (err) {
          console.error(`${err.name}, ${err.message}`);
        }
      };
      await requestWakeLock();
    }
  }, []);
};

export default useLock;

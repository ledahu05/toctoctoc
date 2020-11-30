import { useCallback, useEffect, useState, useRef, ChangeEvent } from 'react';
import styled from 'styled-components';
import { ButtonCTA } from '../components/button';
import Countdown from '../components/countdown';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../state/features/types';
import {

  setWolfSpeed
} from '../state/features/wolf/actions';
import { NextPage } from 'next';

import { floor } from 'lodash';


const GONG_URL = '/sound/gong-doux.mp3'
const CLOCK_URL = '/images/reveil.svg';
const ButtonContainer = styled.div``;
const FormContainer = styled.div`
  max-width: 30rem;
`;

const formatSpeed = (initialSpeed: number): number[] => {
  return [floor(initialSpeed), (initialSpeed % 1) * 60]
}

const TimeWrapper = styled.div``
const IndexPage: NextPage = () => {
  const { wolfSpeed } = useSelector((state: AppState) => {
    return state.wolf;
  });

  const [timerDuration, setTimerDuration] = useState(wolfSpeed);
  const [restart, setRestart] = useState(true);
  const [min, sec] = formatSpeed(wolfSpeed);
  const [minutes, setMinutes] = useState(min.toString());
  const [seconds, setSeconds] = useState(sec.toString());
  // const [playing, toggle] = useAudio(GONG_URL);
  // if () return [false, () => { }];
  const [audio] = useState(typeof window === 'undefined' ? null : new Audio(GONG_URL));
  const [playing, setPlaying] = useState(false);

  const [wolfState, setWolfState] = useState('stopped');
  const [timeLeft, setTimeLeft] = useState(wolfSpeed * 60);
  const dispatch = useDispatch();
  const intervalRef = useRef<number>()


  const toggleRestart = () => setRestart(!restart)

  const onMinutes = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMinutes(e.target.value)
  }, [])
  const onSeconds = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSeconds(e.target.value)
  }, [])





  useEffect(() => {
    if (audio !== null) {

      audio.addEventListener('ended', () => setPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false));
      };
    }
  }, []);

  useEffect(() => {
    if (wolfState === 'started') {
      if (intervalRef.current === undefined) {
        setTimeLeft(timerDuration)
        // console.log('starting interval');
        intervalRef.current = setInterval(() => {
          // console.log('setting interval')
          setTimeLeft(old => {
            return old - 1
          });
        }, 1000)

        // console.log('starting outer timeout')
        setTimeout(() => {
          clearInterval(intervalRef.current)
          setWolfState('stopped');
          if (audio !== null && !playing) audio.play();
          if (restart) {
            // console.log('starting inner timeout')
            // setTimeout(() => {
            // console.log('restarting, timerduration, timeleft', timerDuration, timeLeft)
            if (intervalRef.current !== undefined) {
              intervalRef.current = undefined
            }

            setWolfState('started')
            setTimeout(() => { if (audio !== null) audio.pause() }, 2000)
          }
        }, timerDuration * 1000);
      }


    } else if (wolfState === 'stopped') {
      console.log('stopped');
    }
  }, [wolfState, timeLeft, timerDuration]);



  const onSubmit = useCallback(() => {
    // console.log('onSubmit playing', playing)
    if (audio !== null && playing) {
      audio.pause();
      return;
    }

    if (wolfState === 'started') {
      return;
    }


    console.log('---------------> Was THERE !!!!!!!!!!!!!!!!!!!!!!!!!')
    const speedFloat = +minutes + (parseInt(seconds) / 60);
    dispatch(setWolfSpeed(speedFloat));
    setWolfState('started')
    setTimerDuration(speedFloat * 60)
    setTimeLeft(speedFloat * 60)
    if (intervalRef.current !== undefined) {
      intervalRef.current = undefined
    }
  }, [timerDuration, minutes, seconds, playing]);

  const getCurrentScreen = () => {
    if (wolfState === 'stopped') {
      return (
        <div className='flex justify-center'>


          <FormContainer className='form-container flex flex-col items-center max-w-xl'>
            <h1 className='text-4xl text-center text-gray-700 dark:text-gray-100'>
              Toc toc toc
              </h1>
            <ButtonContainer className='mt-5 sm:mt-8 sm:flex sm:justify-center '>
              <ButtonCTA
                imageRelativeURL={CLOCK_URL}
                variant='primary'
                onClick={onSubmit}
              ></ButtonCTA>
            </ButtonContainer>

            <TimeWrapper className="flex justify-between w-full">
              <div className='mt-1 relative rounded-md shadow-sm md:mr-5'>
                <input
                  value={minutes}
                  onChange={onMinutes}
                  type='number'
                  id='minutes'
                  className='w-full focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-12 sm:text-sm border-gray-300 rounded-md'
                  placeholder='0'
                />

                <div className='absolute inset-y-0 right-0 flex items-center justify-center'>
                  <label htmlFor='time' className='sr-only'>
                    Unit of time
                  </label>
                  <label className='flex items-center justify-center h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md'>
                    min
                  </label>
                </div>
              </div>
              <div className='mt-1 relative rounded-md shadow-sm '>
                <input
                  value={seconds}
                  onChange={onSeconds}
                  type='number'
                  id='minutes'
                  className='w-full focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-12 sm:text-sm border-gray-300 rounded-md'
                  placeholder='0'
                />

                <div className='absolute inset-y-0 right-0 flex items-center justify-center'>
                  <label htmlFor='time' className='sr-only'>
                    Unit of time
                  </label>
                  <label className='flex items-center justify-center h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md'>
                    secs
                  </label>
                </div>
              </div>

            </TimeWrapper>
            <div className="self-end mt-3">
              <label className="flex justify-center">
                <Toggle
                  defaultChecked={restart}
                  onChange={toggleRestart} />
                <span className="ml-2">Repeat</span>
              </label>
            </div>





          </FormContainer>
        </div>
      );
    } else if (wolfState === 'started') {
      return (
        <div className='flex justify-center'>


          <FormContainer className='form-container flex flex-col items-center'>
            <h1 className='text-4xl text-center text-gray-700 dark:text-gray-100'>
              Toc toc toc
          </h1>

            <Countdown time={timerDuration} timeLeft={timeLeft} />
          </FormContainer>
        </div>

      );
    }
  }

  return (
    <div>
      <div className='py-20 px-10'>{getCurrentScreen()}</div>
    </div>
  );
};

export default IndexPage;

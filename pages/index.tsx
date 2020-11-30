import { useCallback, useEffect, useState, useRef, ChangeEvent } from 'react';
import styled from 'styled-components';
import { ButtonCTA } from '../components/button';
import Countdown from '../components/countdown';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../state/features/types';
import {

  setWolfSpeed
} from '../state/features/wolf/actions';
import { NextPage } from 'next';
import useAudio from '../lib/useAudio';
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
  const [min, sec] = formatSpeed(wolfSpeed);
  const [minutes, setMinutes] = useState(min);
  const [seconds, setSeconds] = useState(sec);

  const [playing, toggle] = useAudio(GONG_URL);

  const [wolfState, setWolfState] = useState('stopped');



  const [timeLeft, setTimeLeft] = useState(wolfSpeed * 60);


  const dispatch = useDispatch();


  const intervalRef = useRef<number>()



  const onMinutes = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMinutes(+e.target.value)
  }, [])
  const onSeconds = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSeconds(+e.target.value)
  }, [])



  useEffect(() => {
    if (wolfState === 'started') {
      if (intervalRef.current === undefined) {
        intervalRef.current = setInterval(() => {
          setTimeLeft(old => {
            return old - 1
          });
        }, 1000)

        setTimeout(() => {
          clearInterval(intervalRef.current)
          setWolfState('stopped');
          if (!playing) toggle();
        }, wolfSpeed * 60 * 1000);
      }


    } else if (wolfState === 'stopped') {
      console.log('stopped');
    }
  }, [wolfState, timeLeft, playing, toggle]);



  const onSubmit = useCallback(() => {

    const speedFloat = minutes + (seconds / 60);
    dispatch(setWolfSpeed(speedFloat));
    setWolfState('started')
    setTimerDuration(speedFloat * 60)
    setTimeLeft(speedFloat * 60)
    if (intervalRef.current !== undefined) {
      intervalRef.current = undefined
    }
  }, [timerDuration, minutes, seconds]);

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

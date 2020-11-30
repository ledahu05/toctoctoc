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


const GONG_URL = '/sound/gong-doux.mp3'
const CLOCK_URL = '/images/reveil.svg';
const ButtonContainer = styled.div``;
const FormContainer = styled.div`
  max-width: 30rem;
`;

const IndexPage: NextPage = () => {
  const { wolfSpeed } = useSelector((state: AppState) => {
    return state.wolf;
  });


  const [playing, toggle] = useAudio(GONG_URL);

  const [wolfState, setWolfState] = useState('stopped');
  // const [userState, setUserState] = useState('stopped');
  const [speed, setSpeed] = useState(wolfSpeed.toString());
  const [timeLeft, setTimeLeft] = useState(wolfSpeed * 60);


  const dispatch = useDispatch();


  const intervalRef = useRef<number>()


  const onInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSpeed(e.target.value)
  }, [])
  useEffect(() => {
    if (wolfState === 'started') {
      if (intervalRef.current === undefined) {
        console.log('started', timeLeft, wolfSpeed * 60)
        intervalRef.current = setInterval(() => {
          setTimeLeft(old => {
            return old - 1
          });
        }, 1000)

        console.log('creating timeout')
        setTimeout(() => {
          clearInterval(intervalRef.current)
          setWolfState('stopped');
          console.log('done')
          if (!playing) toggle();
        }, wolfSpeed * 60 * 1000);
      }


    } else if (wolfState === 'stopped') {
      console.log('stopped');
    }
  }, [wolfState, timeLeft, playing, toggle]);



  const onSubmit = useCallback(() => {
    const speedFloat = parseFloat(speed);
    console.log('submitting: ', speedFloat)
    dispatch(setWolfSpeed(speedFloat));
    setWolfState('started')
    setTimeLeft(speedFloat * 60)
    if (intervalRef.current !== undefined) {
      intervalRef.current = undefined
    }
  }, [speed]);

  const getCurrentScreen = () => {
    if (wolfState === 'stopped') {
      return (
        <div className='flex justify-center'>


          <FormContainer className='form-container flex flex-col items-center'>
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
            <div className='flex items-center'>
              <div className='mt-1 relative rounded-md shadow-sm '>
                <input
                  value={speed}
                  onChange={onInput}
                  type='text'
                  id='speed'
                  className='w-32 focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-12 sm:text-sm border-gray-300 rounded-md'
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
              <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
                <button
                  onClick={onSubmit}
                  type='submit'
                  className='mt-1 h-10 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Démarrer le minuteur
                </button>
              </div>
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

            <Countdown time={speed * 60} timeLeft={timeLeft} />
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

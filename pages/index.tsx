import {
  useCallback,
  useEffect,
  useState,
  useRef,
  ChangeEvent,
} from 'react';

import styled from 'styled-components';
import { ButtonCTA } from '../components/button';
import Countdown from '../components/countdown';

// import Toggle from 'react-toggle';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../state/features/types';
import { setWolfSpeed } from '../state/features/wolf/actions';
import { NextPage } from 'next';

import { floor } from 'lodash';
import Alarm, { SoundStatus } from '../components/alarm';
import useLock from '../components/useLock';
import IncrementField from '../components/incrementField';

const GONG_URL = '/sound/gong-doux.mp3';
const CLOCK_URL = '/images/reveil.svg';
const ButtonContainer = styled.div``;
const FormContainer = styled.div`
  max-width: 30rem;
`;

const formatSpeed = (initialSpeed: number): number[] => {
  return [floor(initialSpeed), (initialSpeed % 1) * 60];
};

type TimerStatus = 'STARTED' | 'STOPPED' | 'PAUSED';
const TimeWrapper = styled.div``;
const IndexPage: NextPage = () => {
  const { wolfSpeed } = useSelector((state: AppState) => {
    return state.wolf;
  });

  const [timerDuration, setTimerDuration] = useState(wolfSpeed);
  const [timerTotalTimeRun, setTimerTotalTimeRun] = useState(0);
  const [restart, setRestart] = useState(true);
  const [repeat, setRepeat] = useState(0);
  const [remainingRepeat, setRemainingRepeat] = useState(0);
  // const [pauseTimer, setPauseTimer] = useState(false);
  const [min, sec] = formatSpeed(wolfSpeed);
  const [minutes, setMinutes] = useState(min.toString());
  const [seconds, setSeconds] = useState(sec.toString());
  const [soundStatus, setSoundStatus] = useState<SoundStatus>(
    'STOPPED',
  );

  const [timerState, setTimerState] = useState<TimerStatus>(
    'STOPPED',
  );
  const [timeLeft, setTimeLeft] = useState(wolfSpeed * 60);
  const dispatch = useDispatch();
  const intervalRef = useRef<number>();
  const timerRef = useRef<number>();
  useLock();
  const toggleTimer = () => {
    if (soundStatus === 'PLAYING') setSoundStatus('PAUSED');
    if (soundStatus === 'PAUSED') setSoundStatus('PLAYING');
    switch (timerState) {
      case 'STARTED':
        setTimerState('PAUSED');
        break;
      case 'PAUSED':
        setTimerState('STARTED');
        break;
      default:
        break;
    }
    // console.log('pauseRef.current', pauseRef.current);
  };
  const toggleRestart = () => setRestart(!restart);

  const onMinutes = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setMinutes(e.target.value);
    },
    [],
  );
  const onSeconds = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSeconds(e.target.value);
    },
    [],
  );

  useEffect(() => {
    setRemainingRepeat(repeat);
  }, [repeat]);
  useEffect(() => {
    function Timer(fn: () => void, countdown: number) {
      let complete = false;

      function cancel() {
        if (timerRef.current !== undefined)
          clearTimeout(timerRef.current);
      }

      function pause() {
        if (timerRef.current !== undefined) {
          clearTimeout(timerRef.current);

          setTimerTotalTimeRun((old) => countdown - timeLeft * 1000);
          complete = timeLeft === 0;
          // console.log(
          //   'cancelling timout',
          //   timerTotalTimeRun,
          //   countdown - timeLeft * 1000,
          //   countdown,
          //   timeLeft,
          //   complete,
          // );
        }
      }

      function resume() {
        // console.log(
        //   'resume',
        //   complete,
        //   countdown,
        //   timerTotalTimeRun,
        //   countdown - timerTotalTimeRun,
        // );

        timerRef.current = complete
          ? undefined
          : setTimeout(fn, countdown - timerTotalTimeRun);
      }

      // console.log('total time run', timerTotalTimeRun);

      return { cancel: cancel, pause: pause, resume: resume };
    }

    const callback = () => {
      clearInterval(intervalRef.current);
      setTimerState('STOPPED');
      setSoundStatus('STOPPED');
      if (remainingRepeat > 0) {
        console.log('restart', remainingRepeat);
        setRemainingRepeat(remainingRepeat - 1);
        setTimerState('STARTED');
        if (timerTotalTimeRun !== 0) {
          console.log(
            'restart, reset timerTotalTimeRun',
            timerTotalTimeRun,
          );
          setTimerTotalTimeRun(0);
          setTimeLeft(timerDuration);
        }
        if (intervalRef.current !== undefined) {
          //
          intervalRef.current = undefined;
        }
      }
    };

    const timer = Timer(callback, timerDuration * 1000);

    if (timerState === 'STARTED') {
      if (intervalRef.current === undefined) {
        // console.log(
        //   'timerDuration, timerTotalTimeRun',
        //   timerDuration,
        //   Math.round(timerTotalTimeRun / 1000),
        // );

        setRemainingRepeat(repeat);
        setTimeLeft(
          timerDuration - Math.round(timerTotalTimeRun / 1000),
        );

        intervalRef.current = setInterval(() => {
          setTimeLeft((old) => {
            return old - 1;
          });
        }, 1000);

        timer.resume();
      }
    }
    if (timerState === 'PAUSED') {
      // console.log('PAUSED', timerState, timeLeft, timerDuration);
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
        timer.pause();
      }
    }
  }, [timerState, timeLeft, timerDuration]);

  const onSubmit = useCallback(() => {
    if (timerState === 'STARTED') {
      return;
    }

    const speedFloat = +minutes + parseInt(seconds) / 60;
    dispatch(setWolfSpeed(speedFloat));
    setTimerState('STARTED');
    setTimerDuration(speedFloat * 60);
    setTimeLeft(speedFloat * 60);
    if (intervalRef.current !== undefined) {
      intervalRef.current = undefined;
    }
  }, [timerDuration, minutes, seconds, soundStatus]);

  const getCurrentScreen = () => {
    if (timerState === 'STOPPED') {
      return (
        <div className="flex justify-center">
          <FormContainer className="form-container flex flex-col items-center max-w-xl">
            <h1 className="text-4xl text-center text-gray-700 dark:text-gray-100">
              Toc toc toc
            </h1>
            <ButtonContainer className="mt-5 sm:mt-8 sm:flex sm:justify-center ">
              <ButtonCTA
                imageRelativeURL={CLOCK_URL}
                variant="primary"
                onClick={onSubmit}
              ></ButtonCTA>
            </ButtonContainer>

            <TimeWrapper className="flex justify-between w-full">
              <div className="mt-1 relative rounded-md shadow-sm md:mr-5">
                <input
                  value={minutes}
                  onChange={onMinutes}
                  type="number"
                  id="minutes"
                  className="w-full focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />

                <div className="absolute inset-y-0 right-0 flex items-center justify-center">
                  <label htmlFor="time" className="sr-only">
                    Unit of time
                  </label>
                  <label className="flex items-center justify-center h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
                    min
                  </label>
                </div>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm ">
                <input
                  value={seconds}
                  onChange={onSeconds}
                  type="number"
                  id="minutes"
                  className="w-full focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />

                <div className="absolute inset-y-0 right-0 flex items-center justify-center">
                  <label htmlFor="time" className="sr-only">
                    Unit of time
                  </label>
                  <label className="flex items-center justify-center h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
                    secs
                  </label>
                </div>
              </div>
            </TimeWrapper>
            <IncrementField
              label="Repeat"
              counter={repeat}
              setCounter={setRepeat}
            />
          </FormContainer>
        </div>
      );
    } else if (timerState === 'STARTED' || timerState === 'PAUSED') {
      return (
        <div className="flex justify-center">
          <FormContainer className="form-container flex flex-col items-center">
            <h1 className="text-4xl text-center text-gray-700 dark:text-gray-100">
              Toc toc toc
            </h1>

            <Countdown
              time={timerDuration}
              timeLeft={timeLeft}
              soundStatus={soundStatus}
              setSoundStatus={setSoundStatus}
              toggleTimer={toggleTimer}
            />
            <Alarm
              url={GONG_URL}
              soundStatus={soundStatus}
              setSoundStatus={setSoundStatus}
            />
          </FormContainer>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="py-20 px-10">{getCurrentScreen()}</div>
    </div>
  );
};

export default IndexPage;

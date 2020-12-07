/* eslint-disable react/prop-types */
import React, {
  useCallback,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import styled from 'styled-components';
import { SoundStatus } from './alarm';

const CountdownContainer = styled.div<{ remainingPathColor: string }>`
  width: 20rem;
  height: 20rem;
  position: relative;
  /* Sets the containers height and width */
  .base-timer {
    position: relative;
    height: 300px;
    width: 300px;
  }

  /* Removes SVG styling that would hide the time label */
  .base-timer__circle {
    fill: none;
    stroke: none;
  }

  /* The SVG path that displays the timer's progress */
  .base-timer__path-elapsed {
    stroke-width: 7px;
    stroke: grey;
  }

  .base-timer__label {
    position: absolute;

    /* Size should match the parent container */
    width: 320px;
    height: 320px;

    /* Keep the label aligned to the top */
    top: 0;
    /* transform:translateY(-50%); */

    /* Create a flexible box that centers content vertically and horizontally */
    display: flex;
    align-items: center;
    justify-content: center;

    /* Sort of an arbitrary number; adjust to your liking */
    font-size: 48px;
  }

  .base-timer__path-remaining {
    /* Just as thick as the original ring */
    stroke-width: 7px;

    /* Rounds the line endings to create a seamless circle */
    stroke-linecap: round;

    /* Makes sure the animation starts at the top of the circle */
    transform: rotate(90deg);
    transform-origin: center;

    /* One second aligns with the speed of the countdown timer */
    transition: 1s linear all;

    /* Allows the ring to change color when the color value updates */
    stroke: ${(props) => props.remainingPathColor};
  }

  .base-timer__svg {
    /* Flips the svg and makes the animation to move left-to-right */
    transform: scaleX(-1);
  }

  .base-timer__path-remaining.green {
    color: rgb(65, 184, 131);
  }

  .base-timer__path-remaining.orange {
    color: orange;
  }

  .base-timer__path-remaining.red {
    color: red;
  }
`;

const WARNING_THRESHOLD = 10;

// Alert occurs at 5s
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: 'green',
  },
  warning: {
    color: 'orange',
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: 'red',
    threshold: ALERT_THRESHOLD,
  },
};

const FULL_DASH_ARRAY = 283;

function calculateTimeFraction(
  time: number,
  timeLeft: number,
): number {
  const rawTimeFraction = timeLeft / time;
  return rawTimeFraction - (1 / time) * (1 - rawTimeFraction);
}

// setSoundStatus: Dispatch<SetStateAction<SoundStatus>>

interface CountdownProps {
  time: number;
  timeLeft: number;
  setSoundStatus: Dispatch<SetStateAction<SoundStatus>>;
  soundStatus: SoundStatus;
  toggleTimer: () => void;
}

const Countdown: React.FC<CountdownProps> = ({
  time,
  timeLeft,
  setSoundStatus,
  soundStatus,
  toggleTimer,
}) => {
  const [timeFraction, setTimeFraction] = useState(FULL_DASH_ARRAY);
  const [remainingPathColor, setRemainingPathColor] = useState(
    COLOR_CODES.info.color,
  );
  useEffect(() => {
    // const fraction = Math.round(FULL_DASH_ARRAY * timeLeft / time)
    setTimeFraction(
      calculateTimeFraction(time, timeLeft) * FULL_DASH_ARRAY,
    );

    const { alert, warning } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      setRemainingPathColor(alert.color);

      if (soundStatus !== 'PLAYING' && timeLeft > 0) {
        console.log(
          'alarm triggered by countdown on alert threshold',
          soundStatus,
          timeLeft,
        );
        setSoundStatus('PLAYING');
      }

      // If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
    } else if (timeLeft <= warning.threshold) {
      setRemainingPathColor(warning.color);
    }
  }, [timeLeft, time]);

  const formatTime = useCallback(
    (timeLeft) => {
      const minutes = Math.floor(timeLeft / 60);

      // Seconds are the remainder of the time divided by 60 (modulus operator)
      const seconds = timeLeft % 60;
      let secondsStr = seconds.toString();
      // If the value of seconds is less than 10, then display seconds with a leading zero
      if (seconds < 10) {
        secondsStr = `0${seconds}`;
      }

      // The output in MM:SS format
      return `${minutes}:${secondsStr}`;
    },
    [timeLeft],
  );
  return (
    <CountdownContainer
      className="base-timer mt-4"
      remainingPathColor={remainingPathColor}
      onClick={() => toggleTimer()}
    >
      <svg
        className="base-timer__svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="base-timer__circle">
          <circle
            className="base-timer__path-elapsed"
            cx="50"
            cy="50"
            r="45"
          />
          <path
            id="base-timer-path-remaining"
            strokeDasharray={`${timeFraction.toFixed(
              0,
            )} ${FULL_DASH_ARRAY}`}
            className="base-timer__path-remaining"
            d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" className="base-timer__label">
        {formatTime(timeLeft)}
      </span>
    </CountdownContainer>
  );
};

export default Countdown;

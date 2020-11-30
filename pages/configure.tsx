
import { useEffect, useCallback } from 'react'
import styled from 'styled-components';
import {
  useBroadcaster,
  useListener,
} from '../lib/broadcasters';
import {
  targetValue,
  isNumber,
  filter
} from '../lib/operators';

import { pipe } from 'lodash/fp';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../state/features/types';
import { setWolfSpeed, startWolfApp, stopWolf } from '../state/features/wolf/actions';
import { NextPage } from 'next';
import Router from 'next/router';

// const CLOCK_URL = '/images/reveil.svg'

// const ButtonContainer = styled.div``;

const FormContainer = styled.div`
  max-width:30rem;
`

const ConfigurePage: NextPage = () => {
  const { wolfApp, wolfCounter, userCounter, wolfSpeed } = useSelector((state: AppState) => {
    return state.wolf;
  });

  const onInput = useListener();
  const onUnitOfTime = useListener();

  const timeValue = targetValue(onInput);
  const timeBroadcaster = pipe(

    filter((value) => !isNaN(value))

  )(timeValue);

  const time = useBroadcaster(timeBroadcaster, wolfSpeed);
  const unitOfTime = useBroadcaster(targetValue(onUnitOfTime), 'Minutes');




  useEffect(() => {
    if (wolfApp === 'stopped') {
      dispatch(startWolfApp())
    }
    if (wolfCounter === 'started') {
      dispatch(stopWolf())
    }

  }, [wolfApp, stopWolf])

  const dispatch = useDispatch();



  const onSubmit = useCallback(() => {
    const speed = unitOfTime === 'Minutes' ? +time * 60 * 1000 : +time * 60 * 60 * 1000
    dispatch(setWolfSpeed(5000))
    Router.push('/');
  }, [time, unitOfTime])


  return (
    <div>

      <div className='py-20 px-10 flex flex-col items-center'>
        <>
          <h1 className='text-4xl text-center text-gray-700 dark:text-gray-100'>
            How fast is the wolf ?
          </h1>
          <h3 className='mt-3 text-xl text-center text-gray-700 dark:text-gray-100'>
            This is the average time after which a reminder is sent to you
          </h3>

          <FormContainer className="form-container">

            <div className="flex items-center">

              <div className="mt-1 relative rounded-md shadow-sm ">
                <input value={time} onChange={onInput} type="text" id="speed" className="w-48 focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="0" />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <label htmlFor="time" className="sr-only">Unit of time</label>
                  <select value={unitOfTime} onChange={onUnitOfTime} id="time" className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md" >
                    <option>Minutes</option>
                    <option>Hours</option>
                  </select>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button onClick={onSubmit} type="submit" className="mt-1 h-10 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Save
              </button>
              </div>
            </div>

          </FormContainer>



        </>
      </div>
    </div>
  );
}

export default ConfigurePage;

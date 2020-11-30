// import { call, put, takeEvery, fork } from 'redux-saga/effects';
// import { stopWolf } from './actions';
// import {
// StartWolfAction,
// StopWolfAction,
// WOLF_START,
// WOLF_STOP
// } from './types';

// export const sleep = (time: number): Promise<number> =>
//   new Promise((resolve) => setTimeout(resolve, time));

// function* wolfStartAction(action: StartWolfAction) {
//   console.log('wolfStartAction', action);
//   yield sleep(1000);
// }

// function* watchWolfStart() {
//   yield takeEvery(WOLF_START, wolfStartAction);
// }

// function* wolfStopAction(action: StopWolfAction) {
//   console.log('wolfEndAction', action);
//   yield put(stopWolf());
// }

// function* watchWolfEnd() {
//   yield takeEvery(WOLF_STOP, wolfStopAction);
// }

const wolfSagas = [];
export default wolfSagas;

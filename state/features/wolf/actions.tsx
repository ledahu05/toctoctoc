import {
  WOLF_APP_START,
  WOLF_APP_STOP,
  // WOLF_START,
  // WOLF_STOP,
  // USER_START,
  // USER_STOP,
  SET_WOLF_SPEED
} from './types'

import { AppActions } from '../types'

export const startWolfApp = (): AppActions => {
  return {
    type: WOLF_APP_START,
  }
}
export const stopWolfApp = (): AppActions => {
  return {
    type: WOLF_APP_STOP,
  }
}
// export const startWolf = (): AppActions => {
//   return {
//     type: WOLF_START
//   }
// }

// export const stopWolf = (): AppActions => {
//   return {
//     type: WOLF_STOP,
//   }
// }

// export const startUserApp = (): AppActions => {
//   return {
//     type: USER_START,
//   }
// }
// export const stopUserApp = (): AppActions => {
//   return {
//     type: USER_STOP,
//   }
// }

export const setWolfSpeed = (wolfSpeed: number): AppActions => {
  return {
    type: SET_WOLF_SPEED,
    payload: {
      wolfSpeed
    }
  }
}




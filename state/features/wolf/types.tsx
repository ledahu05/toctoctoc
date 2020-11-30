

export const WOLF_APP_START = 'WOLF_APP_START'
export const WOLF_APP_STOP = 'WOLF_APP_STOP'
// export const WOLF_START = 'WOLF_START'
// export const WOLF_STOP = 'WOLF_STOP'
// export const USER_START = 'USER_START'
// export const USER_STOP = 'USER_STOP'
export const SET_WOLF_SPEED = 'SET_WOLF_SPEED'



export interface StartWolfAppAction {
  type: typeof WOLF_APP_START
}

export interface StopWolfAppAction {
  type: typeof WOLF_APP_STOP
}
// export interface StartWolfAction {
//   type: typeof WOLF_START
// }

// export interface StopWolfAction {
//   type: typeof WOLF_STOP
// }
// export interface StartUserAction {
//   type: typeof USER_START
// }

// export interface StopUserAction {
//   type: typeof USER_STOP
// }
export interface SetWolfSpeedAction {
  type: typeof SET_WOLF_SPEED
  payload: {
    wolfSpeed: number;
  }
}



export type WolfActionTypes =
  | StartWolfAppAction
  // | StartWolfAction
  // | StartUserAction
  | StopWolfAppAction
  // | StopWolfAction
  // | StopUserAction
  | SetWolfSpeedAction


export interface WolfState {
  wolfApp: 'stopped' | 'started',
  // wolfCounter: 'stopped' | 'started',
  // userCounter: 'stopped' | 'started',
  wolfSpeed: number;
}

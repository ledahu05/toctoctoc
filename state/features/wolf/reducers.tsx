import {
  WolfState,
  WolfActionTypes,
  WOLF_APP_START,
  WOLF_APP_STOP,
  // WOLF_START,
  // WOLF_STOP,
  // USER_START,
  // USER_STOP,
  SET_WOLF_SPEED
} from './types'

export const initialWolfState: WolfState = {
  wolfApp: 'stopped',
  // wolfCounter: 'stopped',
  // userCounter: 'stopped',
  wolfSpeed: 15, //minutes
}

const WolfReducer = (
  state = initialWolfState,
  action: WolfActionTypes
): WolfState => {
  switch (action.type) {
    case WOLF_APP_START:
      return {
        ...state,
        wolfApp: 'started',
      }
    case WOLF_APP_STOP:
      return {
        ...state,
        wolfApp: 'stopped',
      }
    // case USER_START:
    //   return {
    //     ...state,
    //     userCounter: 'started',
    //   }
    // case USER_STOP:
    //   return {
    //     ...state,
    //     userCounter: 'stopped',
    //   }

    // case WOLF_START:
    //   return {
    //     ...state,
    //     wolfCounter: 'started',
    //   }

    // case WOLF_STOP:
    //   return {
    //     ...state,
    //     wolfCounter: 'stopped',
    //   }
    case SET_WOLF_SPEED:
      return {
        ...state,
        wolfSpeed: action.payload.wolfSpeed
      }

    default:
      return state
  }
}

export default WolfReducer

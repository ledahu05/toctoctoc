import { combineReducers } from 'redux'

import WolfReducer from './wolf/reducers'

export const rootReducer = combineReducers({

  wolf: WolfReducer,

})




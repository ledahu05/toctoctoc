import { combineReducers } from 'redux'
import { all } from 'redux-saga/effects'
import WolfReducer from './wolf/reducers'
import wolfSagas from './wolf/sagas'
export const rootReducer = combineReducers({

  wolf: WolfReducer,

})


export function* rootSaga() {
  yield all([...wolfSagas])
}


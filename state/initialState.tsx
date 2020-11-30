import { AppState } from './features/types'
import { initialWolfState } from './features/wolf/reducers'

const initialState: AppState = {
  wolf: initialWolfState,
}

export default initialState

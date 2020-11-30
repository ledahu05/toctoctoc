import { useMemo } from 'react'
import { CombinedState, createStore, Store, compose, applyMiddleware } from 'redux'

import { rootReducer, rootSaga } from './features'
import sagaMiddleware from './middlewares/sagas'
// import sagaMiddleware from './middlewares/sagas'
import { AppActions, AppState } from './features/types'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'
import initialState from './initialState'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R
  }
}

type STORE = Store<CombinedState<AppState>, AppActions> | undefined
let store: STORE;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose



export default function configureStore(preloadedState = initialState): Store<AppState> {
  const persistedState = null
  // const middlewares = applyMiddleware(sagaMiddleware)
  const store = createStore(
    rootReducer,
    persistedState || preloadedState,
    // composeEnhancers(middlewares)
  )
  store.subscribe(
    throttle(() => {
      saveState({

        wolf: store.getState().wolf,

      })
    }, 1000)
  )

  return store
}


export const initializeStore = (preloadedState: AppState): STORE => {
  let _store = store ?? configureStore(preloadedState)
  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = configureStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState: AppState): STORE {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}

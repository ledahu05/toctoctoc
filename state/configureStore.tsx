import { useMemo } from 'react'
import { CombinedState, createStore, Store, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer } from './features'

import { AppActions, AppState } from './features/types'
import initialState from './initialState'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R
  }
}

type STORE = Store<CombinedState<AppState>, AppActions> | undefined
let store: STORE;

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose



export default function configureStore(preloadedState = initialState): Store<AppState> {
  // const persistedState = loadState()
  // const middlewares = applyMiddleware(sagaMiddleware)
  const store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  )



  // store.subscribe(
  //   throttle(() => {
  //     saveState({

  //       wolf: store.getState().wolf,

  //     })
  //   }, 1000)
  // )

  return store
}


export const initializeStore = (preloadedState: AppState) => {
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

export function useStore(initialState: AppState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}

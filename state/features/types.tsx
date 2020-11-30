import { WolfActionTypes, WolfState } from './wolf/types'

export interface Error {
  error: string
}
export type AppActions =
  WolfActionTypes


export interface AppState {

  wolf: WolfState

}

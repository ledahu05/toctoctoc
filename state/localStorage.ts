import { AppState } from './features/types';

const TTL = 10 * 60 * 1000; // 30minutes
type PERSISTED_STATE = Pick<AppState, 'wolf'>;

type ITEM = {
  expiry: number;
  data: PERSISTED_STATE;
};

export const loadState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    const item: ITEM = JSON.parse(serializedState);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return undefined so reducers inititialized themselves on their own
      localStorage.removeItem('state');
      return undefined;
    }

    return item.data;
  } catch (err) {
    return undefined;
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const saveState = (state: PERSISTED_STATE) => {
  try {
    const now = new Date();

    const updatedState = {
      wolf: {
        ...state.wolf,
        error: '',
        forgotPasswordLoading: false,
        forgotPasswordSuccess: false,
        forgotPasswordFailure: false,
        loginfailure: false
      }
    };

    const item: ITEM = {
      data: updatedState,
      expiry: now.getTime() + TTL
    };

    const serializedState = JSON.stringify(item);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};

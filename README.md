# redux-dispatch-promise

### Setup

```js
// redux store - apply redux-thunk middleware
import thunk from 'redux-thunk';
import { matchAnyFailure, getAsyncDispatch } from 'redux-dispatch-promise';

const appReducer = combineReducers({ account });
const rootReducer = (state: any, action: any) => {
  //root actions goes here like app-wide logoff
  // use match helper to match any 401 error to trigger logoff
  if (action.type === LOG_OFF || matchAnyFailure(action, (type, data) => data.status === 401)) {
    // setting app state to undefined forces redux to load initial state for all reducers
    state = undefined;
  }

  return appReducer(state, action);
};
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export default store;

export const dispatchAsync = getAsyncDispatch(store);

// action constants
export const ASYNC_LOGIN = createAsyncActions('ACCOUNT/LOGIN');
// produces ACCOUNT_LOGIN, ACCOUNT_LOGIN_SUCCESS, ACCOUNT_LOGIN_FAILURE

// reducer
export default function accountReducer(state, action) {
  switch (action.type) {
    /*   
         action.type: string;
         action.data?: any;
         action.params?: any;
    */
    case pickSuccessAction(ASYNC_LOGIN):
    // update state here
    default:
      return state;
  }
}

// action creator
export async function callApi() {
  const promise = await asyncCall();
  return dispatchAsync(promise, ASYNC_LOGIN, params);  // params are passed through consistently to all action states
}
```

### Changelog
- v1.1.5 - add `getDispatch` for sync mutations
- v1.1.1 - minor refactor, stronger types
- v1.1.0 - added helpers to match any successful/failed actions. useful for handling actions with app-wide effects - ex. 401 error from a route that should cause entire store to reset.

---

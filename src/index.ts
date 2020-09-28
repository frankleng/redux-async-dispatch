import { Store } from 'redux';

type DispatchableAction = {
  type: string;
  data?: any;
  params?: any;
};

type AsyncAction = string[];

const successSuffix = '__SUCCESS_ASYNC_ACTION';
const failureSuffix = '__FAILURE_ASYNC_ACTION';

export function createAsyncActions(constant: string) {
  return [constant, `${constant}${successSuffix}`, `${constant}${failureSuffix}`];
}

export function pickInitAction([initAction]: AsyncAction) {
  return initAction;
}

export function pickSuccessAction([, successAction]: AsyncAction) {
  return successAction;
}

export function pickFailureAction([, , failureAction]: AsyncAction) {
  return failureAction;
}

export function matchAnySuccessAction(
  action: DispatchableAction,
  matcher?: (type: string, data: any) => boolean,
): boolean {
  const isSuccess = !!action.type?.endsWith(successSuffix);
  return matcher ? isSuccess && matcher(action.type, action.data) : isSuccess;
}

export function matchAnyFailureAction(
  action: DispatchableAction,
  matcher?: (type: string, data: any) => boolean,
): boolean {
  const isFailure = !!action.type?.endsWith(failureSuffix);
  return matcher ? isFailure && matcher(action.type, action.data) : isFailure;
}

function getDispatchable(action: DispatchableAction | string): DispatchableAction {
  return typeof action === 'string' ? { type: action } : { ...action };
}

export function getAsyncDispatch(store: Store) {
  const { dispatch } = store;
  return async function asyncDispatch(
    promise: Promise<any>,
    [initAction, successAction, failureAction]: string[],
    params?: any,
  ) {
    if (initAction) dispatch({ ...getDispatchable(initAction), params });

    return promise
      .then((data: {}) => {
        if (successAction) {
          dispatch({ ...getDispatchable(successAction), data, params });
        }
        return data;
      })
      .catch((err) => {
        if (failureAction) {
          dispatch({ ...getDispatchable(failureAction), data: err, params });
        }
        return Promise.reject(err);
      });
  };
}

export function getDispatch(store: Store) {
  const { dispatch } = store;
  return (action: string, data: any, params?: any) => {
    dispatch({ ...getDispatchable(action), data, params });
  };
}

export default getAsyncDispatch;

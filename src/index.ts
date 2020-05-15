type DispatchableAction = {
  type: string;
  data?: any;
};

const successSuffix = '_SUCCESS';
const failureSuffix = '_FAILURE';

function getDispatchable(action: DispatchableAction | string): DispatchableAction {
  return typeof action === 'string' ? { type: action } : { ...action };
}

export function getInitAction([initAction]: string[]) {
  return initAction;
}

export function getSuccessAction([, successAction]: string[]) {
  return successAction;
}

export function getFailureAction([, , failureAction]: string[]) {
  return failureAction;
}

export function matchAnySuccessAction(action: DispatchableAction, matcher?: (data: any) => boolean): boolean {
  const isSuccess = action.type?.endsWith(successSuffix);
  return matcher && action.data ? isSuccess && matcher(action.data) : isSuccess;
}

export function matchAnyFailureAction(action: DispatchableAction, matcher?: (data: any) => boolean): boolean {
  const isFailure = action.type?.endsWith(failureSuffix);
  return matcher && action.data ? isFailure && matcher(action.data) : isFailure;
}

export function getActionConstants(constant: string) {
  return [constant, `${constant}${successSuffix}`, `${constant}${failureSuffix}`];
}

export function getAsyncDispatch(store: { dispatch: any }) {
  return (promise: Promise<any>, [initAction, successAction, failureAction]: string[]) => {
    const { dispatch } = store;

    if (initAction) dispatch(getDispatchable(initAction));

    return promise
      .then((data: {}) => {
        if (successAction) {
          dispatch({ ...getDispatchable(successAction), data });
          return data;
        }
      })
      .catch((err) => {
        if (failureAction) {
          dispatch({ ...getDispatchable(failureAction), data: err });
          return err;
        }
      });
  };
}

export default getAsyncDispatch;

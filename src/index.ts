function getDispatchable(action: {} | string) {
  return typeof action === 'string' ? { type: action } : { ...action };
}

export function getActionConstants(constant: string) {
  return [constant, `${constant}_SUCCESS`, `${constant}_FAILURE`];
}

export function getAsyncDispatch(store: { dispatch: any }) {
  return (promise: Promise<any>, [initAction, successAction, failureAction]: string[], path = null) => {
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
          dispatch({ ...getDispatchable(failureAction) });
          return err;
        }
      });
  };
}

export default getAsyncDispatch;

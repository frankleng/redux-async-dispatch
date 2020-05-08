export declare function getActionConstants(constant: string): string[];
export declare function getAsyncDispatch(store: {
    dispatch: any;
}): (promise: Promise<any>, [initAction, successAction, failureAction]: string[], path?: null) => Promise<any>;
export default getAsyncDispatch;

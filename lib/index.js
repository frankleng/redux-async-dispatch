"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function getDispatchable(action) {
    return typeof action === 'string' ? { type: action } : __assign({}, action);
}
function getActionConstants(constant) {
    return [constant, constant + "_SUCCESS", constant + "_FAILURE"];
}
exports.getActionConstants = getActionConstants;
function getAsyncDispatch(store) {
    return function (promise, _a, path) {
        var initAction = _a[0], successAction = _a[1], failureAction = _a[2];
        if (path === void 0) { path = null; }
        var dispatch = store.dispatch;
        if (initAction)
            dispatch(getDispatchable(initAction));
        return promise
            .then(function (data) {
            if (successAction) {
                dispatch(__assign(__assign({}, getDispatchable(successAction)), { data: data }));
                return data;
            }
        })
            .catch(function (err) {
            if (failureAction) {
                dispatch(__assign({}, getDispatchable(failureAction)));
                return err;
            }
        });
    };
}
exports.getAsyncDispatch = getAsyncDispatch;
exports.default = getAsyncDispatch;

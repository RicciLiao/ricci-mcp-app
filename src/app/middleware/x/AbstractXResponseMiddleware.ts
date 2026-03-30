import {ApiPayloadAction, apiSlice} from "@app/slice/api/apiSlice.ts";
import {mcpSlice} from "@app/slice/api/mcpSlice.ts";
import {responseCodeEnum} from "@common/responseCodeEnum.ts";
import {ResponseData} from "@interfaces/api/x/response/data/ResponseData.ts";
import {BrokenHttp} from "@interfaces/api/x/response/data/SimpleData.ts";
import {XResponse} from "@interfaces/api/x/response/XResponse.ts";
import {Dispatch, isFulfilled, isRejectedWithValue, Middleware, MiddlewareAPI, ThunkDispatch} from "@reduxjs/toolkit";
import {Action} from "redux";

const getProjectCodeByAction = (action: ApiPayloadAction): string => {
    if (Object.keys(mcpSlice.endpoints).find(endpointName => endpointName === action.meta.arg.endpointName)) {

        return "mcp";
    }
    isRejectedWithValue()

    return "";
}

const isHttpErrorPayload = (payload: XResponse<ResponseData>): payload is XResponse<BrokenHttp> => {

    return payload && payload.code.id === responseCodeEnum.BROKEN_HTTP;
}

const isApiSliceAction = (action: any): action is ApiPayloadAction => {

    return action.type.startsWith(`${apiSlice.reducerPath}/`) && isApiSliceActionWithMeta(action);
}

const isApiSliceActionCompletedWithError = (action: ApiPayloadAction): boolean => {

    return (isFulfilled(action) || isRejectedWithValue(action)) && action.payload && action.payload.code.id !== responseCodeEnum.SUCCESS;
}

const isApiSliceActionWithMeta = (action: ApiPayloadAction): boolean => {

    return (!!(
        "meta" in action && action.meta && typeof action.meta === "object"
        && "arg" in action.meta && action.meta.arg && typeof action.meta.arg === "object"
        && "endpointName" in action.meta.arg && action.meta.arg.endpointName
    ));
}

abstract class AbstractXResponseMiddleware<
    D extends ThunkDispatch<S, any, Action> | Dispatch<Action> = ThunkDispatch<any, any, Action> | Dispatch<Action>,
    S = any
> {
    support(action: any): action is ApiPayloadAction {

        return isApiSliceAction(action);
    }

    build(): Middleware<{}, S, D> {

        return (api: MiddlewareAPI<D, S>) => next => async action => {
            if (this.support(action)) {
                this.do(action, api);
            }

            return next(action);
        };
    };

    abstract do(action: ApiPayloadAction, api: MiddlewareAPI<D, S>): void;
}


export {
    AbstractXResponseMiddleware,
    isApiSliceActionCompletedWithError,
    isHttpErrorPayload,
    getProjectCodeByAction,
}

import {ApiPayloadAction} from "@app/slice/api/apiSlice.ts";
import {ResponseData} from "@interfaces/api/x/response/data/ResponseData.ts";
import {XResponse} from "@interfaces/api/x/response/XResponse.ts";
import {isFulfilled, MiddlewareAPI} from "@reduxjs/toolkit";
import {AbstractXResponseMiddleware} from "./AbstractXResponseMiddleware";

class XResponseRTKMiddleware extends AbstractXResponseMiddleware {

    do(action: ApiPayloadAction, _api: MiddlewareAPI): void {
        if (isFulfilled(action)) {
            const payload: XResponse<ResponseData> = action.payload;
            payload.rtkRequestId = action.meta.requestId
        }
    }

}

export {
    XResponseRTKMiddleware,
}
import {ApiPayloadAction} from "@app/slice/api/apiSlice.ts";
import {messageSlice} from "@app/slice/api/messageSlice.ts";
import {addSnackbar} from "@app/slice/appSnackbarSlice.ts";
import {appConstants} from "@common/appConstants.ts";
import {ResponseData} from "@interfaces/api/x/response/data/ResponseData.ts";
import {XResponse} from "@interfaces/api/x/response/XResponse.ts";
import {AppSnackbar} from "@interfaces/AppSnackbar.ts";
import {Action, MiddlewareAPI, ThunkDispatch} from "@reduxjs/toolkit";
import {AbstractXResponseMiddleware, getProjectCodeByAction, isApiSliceActionCompletedWithError, isHttpErrorPayload} from "./AbstractXResponseMiddleware";

export class XResponseCodeMiddleware extends AbstractXResponseMiddleware {

    do(action: ApiPayloadAction, api: MiddlewareAPI<ThunkDispatch<any, any, Action>>): void {
        if (isApiSliceActionCompletedWithError(action)) {
            let appSnackBar: AppSnackbar;
            const payload: XResponse<ResponseData> = action.payload;
            if (isHttpErrorPayload(payload)) {
                appSnackBar = {
                    code: payload.data.status,
                    date: payload.data.date,
                    alertType: appConstants.SNACKBAR_SEVERITY_TYPE.E,
                    message: payload.data.message
                };
                api.dispatch(addSnackbar(appSnackBar));
            } else {
                const consumer = getProjectCodeByAction(action);
                api.dispatch(messageSlice.endpoints.getMessage.initiate({
                    code: payload.code.id,
                    consumer
                })).unwrap()
                    .then(result => {
                        const messageDate = result.data;
                        const alertType = appConstants.SNACKBAR_SEVERITY_TYPE[messageDate.level as keyof typeof appConstants.SNACKBAR_SEVERITY_TYPE];
                        appSnackBar = {
                            code: messageDate.id,
                            date: new Date().getTime(),
                            alertType: alertType,
                            message: messageDate.description
                        };
                        api.dispatch(addSnackbar(appSnackBar));
                    });
            }
        }
    }
}




import {apiSlice} from "@app/slice/api/apiSlice.ts";
import {appConstants} from "@common/appConstants.ts";
import {GetMessage} from "@interfaces/api/GetMessage.ts";
import {MessageCode} from "@interfaces/api/MessageCode.ts";
import {XResponse} from "@interfaces/api/x/response/XResponse.ts";

const messageSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMessage: builder.query<XResponse<MessageCode>, GetMessage>({
            query: arg => ({
                url: `/message/code/${arg.code}/${arg.consumer}`,
                method: appConstants.HTTP_METHOD_GET
            }),
        }),
    })
})

export const {
    useGetMessageQuery,
    useLazyGetMessageQuery,
} = messageSlice;

export {messageSlice};

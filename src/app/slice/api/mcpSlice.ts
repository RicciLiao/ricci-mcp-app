import {McpIdentifier} from "@interfaces/api/McpIdentifier.ts";
import {McpProviderExtraInfo, McpProviderInfo, McpProviderInfoRequest} from "@interfaces/api/McpProviderInfo.ts";
import {apiSlice, type Bool, type Collection, constants, type Str, type XRequest, type XResponse} from "x-common-components-app";

const mcpSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        list: builder.query<XResponse<Collection<McpProviderInfo>>, void>({
            query: () => ({
                url: "/mcp/provider/list",
                method: constants.HTTP_METHOD_GET
            }),
        }),
        upsert: builder.mutation<XResponse<Bool>, XRequest<Collection<McpProviderInfoRequest>>>({
            query: (arg) => ({
                url: "/mcp/provider/upsert",
                method: constants.HTTP_METHOD_POST,
                body: arg.data
            }),
        }),
        extra: builder.query<XResponse<McpProviderExtraInfo>, McpIdentifier>({
            query: (arg) => ({
                url: "/mcp/operation/extra/info",
                method: constants.HTTP_METHOD_GET,
                headers: {
                    "Cache-Customer": arg.consumer,
                    "Cache-Store": arg.store,
                }
            }),
        }),
        passkey: builder.query<XResponse<Str>, XRequest<number>>({
            query: (arg) => ({
                url: `/mcp/provider/passkey/${arg.data}`,
                method: constants.HTTP_METHOD_GET,
            }),
        }),
    })
})

export const {
    useLazyListQuery,
    useListQuery,
    useUpsertMutation,
    useLazyExtraQuery,
    useLazyPasskeyQuery,
} = mcpSlice;

export {mcpSlice};
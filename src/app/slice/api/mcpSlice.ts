import {apiSlice} from "@app/slice/api/apiSlice.ts";
import {appConstants} from "@common/appConstants.ts";
import {McpProviderInfo, McpProviderInfoRequest} from "@interfaces/api/McpProviderInfo.ts";
import {Bool, Collection} from "@interfaces/api/x/response/data/SimpleData.ts";
import {XResponse} from "@interfaces/api/x/response/XResponse.ts";

const mcpSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        list: builder.query<XResponse<Collection<McpProviderInfo>>, void>({
            query: () => ({
                url: "/mcp/provider/list",
                method: appConstants.HTTP_METHOD_GET
            }),
        }),
        upsert: builder.mutation<XResponse<Bool>, Collection<McpProviderInfoRequest>>({
            query: (arg) => ({
                url: "/mcp/provider/upsert",
                method: appConstants.HTTP_METHOD_POST,
                body: arg
            }),
        }),
        create: builder.mutation<XResponse<Bool>, McpProviderInfoRequest>({
            query: (arg) => ({
                url: "/mcp/provider",
                method: appConstants.HTTP_METHOD_POST,
                body: arg
            }),
        }),
    })
})

export const {
    useLazyListQuery,
    useListQuery,
    useUpsertMutation,
    useCreateMutation,
} = mcpSlice;

export {mcpSlice};
interface McpProviderInfo {
    id: number;
    consumer: string;
    store: string;
    provider: number;
    ttlSeconds: number;
    active: boolean;
    statical: boolean;
    createdDtm: number;
    createdBy: string;
    updatedBy: string;
    updatedDtm: number;
    version: number;
}

interface McpProviderInfoRequest extends Omit<McpProviderInfo, "id" | "createdDtm" | "updatedDtm" | "createdBy" | "updatedBy" | "version"> {
    id?: number | null;
    createdDtm?: number | null;
    createdBy?: string | null;
    updatedDtm?: number | null;
    updatedBy?: string | null;
    deleted?: boolean | null;
    version?: number | null;
}


export {
    type McpProviderInfo,
    type McpProviderInfoRequest,
}
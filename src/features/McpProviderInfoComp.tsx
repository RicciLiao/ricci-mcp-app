import {ActionDataGrid, ActionDataGridProps, ActionDataGridRow, ActionDataGridStates} from "@/components/data-grid/ActionDataGrid.tsx";
import {DateTimeEditableCell, NumberEditableCell, SingleSelectEditableCell, StringEditableCell} from "@/components/data-grid/RowEditableCell.tsx";
import {useListQuery, useUpsertMutation} from "@app/slice/api/mcpSlice.ts";
import {responseCodeEnum} from "@common/responseCodeEnum.ts";
import {McpProviderInfoRequest} from "@interfaces/api/McpProviderInfo.ts";
import {Collection} from "@interfaces/api/x/response/data/SimpleData.ts";
import {Box} from "@mui/material";
import {GridColDef, GridRowId} from "@mui/x-data-grid";
import {format} from "date-fns";
import {produce} from "immer";
import React, {useEffect} from "react";

const columns: GridColDef[] = [
    {
        field: '',
        headerName: '',
        width: 20,
        resizable: false,
        editable: false,
        disableColumnMenu: true,
        sortable: false,
    },
    {
        field: 'consumer',
        headerName: 'Consumer',
        width: 130,
        resizable: false,
        editable: true,
        renderEditCell: (params) => <StringEditableCell {...params} />,
    },
    {
        field: 'store',
        headerName: 'Store',
        width: 130,
        resizable: false,
        editable: true,
        renderEditCell: (params) => <StringEditableCell {...params} />,
    },
    {
        field: 'provider',
        headerName: 'Provider',
        width: 130,
        resizable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: [{value: 1000, label: "Redis"}, {value: 1001, label: "Mongo"}],
        renderEditCell: (params) => <SingleSelectEditableCell {...params} />,
    },
    {
        field: 'ttlSeconds',
        headerName: 'TTL(Seconds)',
        width: 150,
        resizable: false,
        editable: true,
        type: "number",
        renderEditCell: (params) => <NumberEditableCell {...params} />,
    },
    {
        field: 'active',
        headerName: 'Active',
        width: 100,
        resizable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: [{value: true, label: "True"}, {value: false, label: "False"}],
        renderEditCell: (params) => <SingleSelectEditableCell {...params} />,
    },
    {
        field: 'statical',
        headerName: 'Statical',
        width: 100,
        resizable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: [{value: true, label: "True"}, {value: false, label: "False"}],
        renderEditCell: (params) => <SingleSelectEditableCell {...params} />,
    },
    {
        field: 'createdDtm',
        headerName: 'Created Date',
        width: 180,
        resizable: false,
        editable: false,
        type: "dateTime",
        valueGetter: (v: number | null) => v ? new Date(v) : null,
        valueFormatter: (v: Date | null) => v ? format(v, 'yyyy-MM-dd HH:mm:ss') : "",
        renderEditCell: (params) => <DateTimeEditableCell {...params} />,
    },
    {
        field: 'updatedDtm',
        headerName: 'Updated Date',
        width: 180,
        resizable: false,
        editable: false,
        type: "dateTime",
        valueGetter: (v: number | null) => v ? new Date(v) : null,
        valueFormatter: (v: Date | null) => v ? format(v, 'yyyy-MM-dd HH:mm:ss') : "",
        renderEditCell: (params) => <DateTimeEditableCell {...params} />,
    },
];

type McpProviderInfoDataRow = McpProviderInfoRequest & ActionDataGridRow;

const McpProviderInfoComp = () => {
    const {data, isFetching: queryFetching, refetch} = useListQuery();
    const [upsert, {isLoading: mutationLoading}] = useUpsertMutation();
    const savingData = React.useRef<Record<string, McpProviderInfoDataRow>>({});

    const [props, setProps] = React.useState<ActionDataGridProps>(
        {
            data: data ? data.data.data : [],
            gridProps: {
                columns,
            },
            rowActionHandlers: {
                handleCancelClick: (id) => {
                    delete savingData.current[id];
                },
                handleDeleteClick: (id: GridRowId, _context: ActionDataGridStates, newRow) => {
                    if (newRow) {
                        savingData.current = {...savingData.current, [id]: newRow as McpProviderInfoDataRow};
                    } else {
                        delete savingData.current[id];
                    }
                },
                handleEditClick: () => {
                },
                handleSaveClick: (id: GridRowId, _context: ActionDataGridStates, newRow) => {
                    if (newRow) {
                        savingData.current = {...savingData.current, [id]: newRow as McpProviderInfoDataRow};
                    }
                },
            },
            toolbarProps: {
                handleSave: () => {
                    const savingList: Collection<McpProviderInfoRequest> = {data: []};
                    for (let key of Object.keys(savingData.current)) {
                        savingList.data.push({
                            active: savingData.current[key].active,
                            consumer: savingData.current[key].consumer,
                            createdDtm: savingData.current[key].createdDtm ?? null,
                            deleted: savingData.current[key].deleted ?? null,
                            id: savingData.current[key].id ?? null,
                            provider: savingData.current[key].provider,
                            statical: savingData.current[key].statical,
                            store: savingData.current[key].store,
                            ttlSeconds: savingData.current[key].ttlSeconds,
                            updatedDtm: savingData.current[key].updatedDtm ?? null,
                            createdBy: "1",
                            updatedBy: "1",
                            version: savingData.current[key].version ?? null,
                        });
                    }
                    upsert(savingList)
                        .unwrap()
                        .then(result => {
                            if (result.code.id === responseCodeEnum.SUCCESS) {
                                savingData.current = {};
                                refetch();
                            }
                        });
                },
                handleRefresh: () => {
                    refetch();
                },
                handleAddRecord: newRecord => {

                    return {...newRecord, provider: 1000, active: false, statical: false}
                },
            },
            loading: queryFetching || mutationLoading
        }
    );
    useEffect(() => {
        setProps(produce(draft => {
            draft.data = data ? data.data.data : [];
            draft.loading = queryFetching || mutationLoading;
        }));
    }, [data, queryFetching, mutationLoading]);

    return (
        <Box width={1350} sx={{margin: "0 auto"}}>
            <ActionDataGrid props={props}/>
        </Box>
    );
}

export {McpProviderInfoComp}
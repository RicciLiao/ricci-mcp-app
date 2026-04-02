import {ActionDataGrid, ActionDataGridProps, ActionDataGridRow, ActionDataGridStates} from "@/components/data-grid/ActionDataGrid.tsx";
import {DateTimeEditableCell, NumberEditableCell, SingleSelectEditableCell, StringEditableCell} from "@/components/data-grid/EditableCell.tsx";
import {useAppDispatch} from "@app/hooks.ts";
import {mcpSlice, useLazyExtraQuery, useLazyPasskeyQuery, useListQuery, useUpsertMutation} from "@app/slice/api/mcpSlice.ts";
import {appConstants} from "@common/appConstants.ts";
import {appUtils} from "@common/appUtils.ts";
import {McpProviderInfoRequest} from "@interfaces/api/McpProviderInfo.ts";
import InfoIcon from '@mui/icons-material/Info';
import {LoadingButton} from "@mui/lab";
import {Box, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import {GridColDef, GridRenderCellParams, GridRowId} from "@mui/x-data-grid";
import {produce} from "immer";
import React, {useEffect} from "react";
import {addSnackbar, type Collection, responseCodeEnum, xConstants} from "x-common-components-app";

type McpProviderInfoDataRow = McpProviderInfoRequest & ActionDataGridRow;

const DetailInformationComp = ({params}: { params: GridRenderCellParams<McpProviderInfoDataRow> }) => {
    const dispatch = useAppDispatch();
    const [openDetail, setOpenDetail] = React.useState<boolean>(false);
    const [getExtra, extraResult] = useLazyExtraQuery();
    const [getPasskey, passkeyResult] = useLazyPasskeyQuery();
    const extraData = extraResult.data;
    const extraIsFetching = extraResult.isFetching;
    const passkeyData = passkeyResult.data;
    const passkeyIsFetching = passkeyResult.isFetching;

    if (typeof params.row.id === 'number') {
        const id: number = params.row.id;
        const handleDetailClick = () => {
            getExtra({
                consumer: params.row.consumer,
                store: params.row.store,
            })
                .unwrap()
                .then(() => {
                    setOpenDetail(true);
                });

        };
        const handlePasskeyClick = () => {
            getPasskey({
                data: id,
                messageArgs: [params.row.consumer, params.row.store]
            });
        }
        const handleDetailClose = () => {
            setOpenDetail(false);
            dispatch(mcpSlice.util.updateQueryData("passkey", {data: id} as any, (draft: any) => {

                return {...draft, data: null as any};
            }));
        }

        return (
            <React.Fragment>
                <IconButton
                    disabled={extraIsFetching || !params.row.id}
                    loading={extraIsFetching}
                    color="primary"
                    size="small"
                    onClick={handleDetailClick}>
                    <InfoIcon fontSize="small"/>
                </IconButton>
                <Dialog onClose={handleDetailClose} open={openDetail}>
                    <DialogTitle>Cache Provider Detail</DialogTitle>
                    <DialogContent sx={{width: 500}}>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {extraData && extraData.code.id === responseCodeEnum.SUCCESS ?
                                        (<>
                                            <TableRow>
                                                <TableCell width="40%">Consumer: </TableCell>
                                                <TableCell width="60%">{extraData.data.mcpIdentifier.consumer}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Store: </TableCell>
                                                <TableCell>{extraData.data.mcpIdentifier.store}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Data Count: </TableCell>
                                                <TableCell>{extraData.data.count}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Data Created Date: </TableCell>
                                                <TableCell>{appUtils.number2DateFormat(extraData.data.createdDtm, appConstants.DATA_FORMAT_YYYY_MM_DD_HH_MM_SS)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Data Max Updated Date: </TableCell>
                                                <TableCell>{appUtils.number2DateFormat(extraData.data.maxUpdatedDtm, appConstants.DATA_FORMAT_YYYY_MM_DD_HH_MM_SS)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Pass Key: </TableCell>
                                                <TableCell>
                                                    {
                                                        passkeyData && passkeyData.code.id === responseCodeEnum.SUCCESS ?
                                                            <span>{passkeyData.data.data}</span>
                                                            :
                                                            <LoadingButton loading={passkeyIsFetching} onClick={handlePasskeyClick} sx={{padding: 0, height: 0}}>Get Passkey</LoadingButton>
                                                    }

                                                </TableCell>
                                            </TableRow>
                                        </>)
                                        :
                                        (
                                            <TableRow>
                                                No Data.
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }

    return (<></>);
}

const columns: GridColDef[] = [
    {
        field: '',
        headerName: '',
        width: 30,
        resizable: false,
        editable: false,
        disableColumnMenu: true,
        sortable: false,
        renderCell: params => <DetailInformationComp params={params as GridRenderCellParams<McpProviderInfoDataRow>}/>,
    },
    {
        field: 'consumer',
        headerName: 'Consumer',
        width: 130,
        resizable: false,
        editable: true,
        renderEditCell: params => <StringEditableCell {...params} />,
    },
    {
        field: 'store',
        headerName: 'Store',
        width: 130,
        resizable: false,
        editable: true,
        renderEditCell: params => <StringEditableCell {...params} />,
    },
    {
        field: 'provider',
        headerName: 'Provider',
        width: 130,
        resizable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: [{value: 1000, label: "Redis"}, {value: 1001, label: "Mongo"}],
        renderEditCell: params => <SingleSelectEditableCell {...params} />,
    },
    {
        field: 'ttlSeconds',
        headerName: 'TTL(Seconds)',
        width: 150,
        resizable: false,
        editable: true,
        type: "number",
        renderEditCell: params => <NumberEditableCell {...params} />,
    },
    {
        field: 'active',
        headerName: 'Active',
        width: 100,
        resizable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: [{value: true, label: "True"}, {value: false, label: "False"}],
        renderEditCell: params => <SingleSelectEditableCell {...params} />,
    },
    {
        field: 'statical',
        headerName: 'Statical',
        width: 100,
        resizable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: [{value: true, label: "True"}, {value: false, label: "False"}],
        renderEditCell: params => <SingleSelectEditableCell {...params} />,
    },
    {
        field: 'createdDtm',
        headerName: 'Created Date',
        width: 180,
        resizable: false,
        editable: false,
        type: "dateTime",
        valueGetter: (v: number | null) => appUtils.number2Date(v),
        valueFormatter: (v: Date | null) => appUtils.date2DateFormat(v, appConstants.DATA_FORMAT_YYYY_MM_DD_HH_MM_SS),
        renderEditCell: params => <DateTimeEditableCell {...params} />,
    },
    {
        field: 'updatedDtm',
        headerName: 'Updated Date',
        width: 180,
        resizable: false,
        editable: false,
        type: "dateTime",
        valueGetter: (v: number | null) => appUtils.number2Date(v),
        valueFormatter: (v: Date | null) => appUtils.date2DateFormat(v, appConstants.DATA_FORMAT_YYYY_MM_DD_HH_MM_SS),
        renderEditCell: params => <DateTimeEditableCell {...params} />,
    },
];


const McpProviderInfoComp = () => {
    const dispatch = useAppDispatch();
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
                handleSaveClick: (id: GridRowId, context: ActionDataGridStates, newRow) => {
                    if (!newRow) {

                        return;
                    }
                    const dataRow = newRow as McpProviderInfoDataRow;
                    if (!dataRow.consumer?.trim()) {
                        dispatch(addSnackbar({
                            code: 0,
                            date: new Date().getTime(),
                            alertType: xConstants.SNACKBAR_SEVERITY_TYPE.W,
                            message: "Consumer cannot be empty.",
                        }));

                        return false;
                    }
                    if (!dataRow.store?.trim()) {
                        dispatch(addSnackbar({
                            code: 0,
                            date: new Date().getTime(),
                            alertType: xConstants.SNACKBAR_SEVERITY_TYPE.W,
                            message: "Store cannot be empty.",
                        }));

                        return false;
                    }
                    if (context.rows.some(row => {
                        const existedRow = row as McpProviderInfoDataRow;
                        return existedRow.rowId !== dataRow.rowId
                            && existedRow.consumer === dataRow.consumer
                            && existedRow.store === dataRow.store;
                    })) {
                        dispatch(addSnackbar({
                            code: 0,
                            date: new Date().getTime(),
                            alertType: xConstants.SNACKBAR_SEVERITY_TYPE.W,
                            message: "Consumer and Store combination already exists.",
                        }));

                        return false;
                    }
                    if (dataRow.statical && (!dataRow.ttlSeconds || dataRow.ttlSeconds === 0)) {
                        dispatch(addSnackbar({
                            code: 0,
                            date: new Date().getTime(),
                            alertType: xConstants.SNACKBAR_SEVERITY_TYPE.W,
                            message: "TTL Seconds must greater than 0 when the store is statical.",
                        }));

                        return false;
                    }
                    savingData.current = {...savingData.current, [id]: dataRow};

                    return true;
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
                    upsert({data: savingList})
                        .unwrap()
                        .then((result: any) => {
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
        <Box width={1300} sx={{margin: "0 auto"}}>
            <ActionDataGrid props={props}/>
        </Box>
    );
}

export {McpProviderInfoComp}
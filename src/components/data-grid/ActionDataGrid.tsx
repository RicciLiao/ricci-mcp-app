import {ActionRow} from "@/components/data-grid/ActionRow.tsx";
import {ActionToolbar} from "@/components/data-grid/ActionToolbar.tsx";
import {styled} from "@mui/material";
import {DataGrid, DataGridProps, gridClasses, GridColDef, GridRowId, GridRowModes, GridRowModesModel, GridRowsProp, GridSlots, GridToolbarProps, ToolbarPropsOverrides} from "@mui/x-data-grid";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import React, {Dispatch, SetStateAction} from "react";
import {z} from "zod";
import {RowActionCell, RowActionHandlers} from "./RowActionCell.tsx";

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    [`& .deleted-row`]: {
        position: 'relative',
        backgroundColor: theme.palette.action.disabledBackground,
        fontStyle: "italic",
        color: "grey",
        textDecoration: 'line-through',

        [`& .${gridClasses.cell}`]: {
            textDecoration: 'line-through',
            color: theme.palette.text.disabled,
        }
    },
}));

interface ActionDataGridRow {
    rowId: GridRowId;
    deleted: boolean;
    edited: boolean;
}

interface ActionDataGridProps {
    gridProps: DataGridProps;
    rowActionHandlers: RowActionHandlers;
    data: any[];
    toolbarProps: ToolbarPropsOverrides;
    loading: boolean;
}

interface ActionDataGridStates {
    rows: GridRowsProp<ActionDataGridRow>,
    setRows: Dispatch<SetStateAction<GridRowsProp<ActionDataGridRow>>>
    rowModesModel: GridRowModesModel,
    setRowModesModel: Dispatch<SetStateAction<GridRowModesModel>>,
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>,
    editing: boolean,
    originRowsRef: React.RefObject<Record<GridRowId, ActionDataGridRow>>,
    formDataRef: React.RefObject<Record<GridRowId, FormData>>,
    setFormData: (rowId: GridRowId, formData: FormData) => void,
    rowTypeRef: React.RefObject<z.ZodObject>,
}

const ActionDataGridStatesContext = React.createContext<ActionDataGridStates>({
    loading: false,
    editing: false,
    setLoading(): void {
    },
    rows: [],
    setRows(): void {
    },
    rowModesModel: {},
    setRowModesModel(): void {
    },
    originRowsRef: {current: {}},
    formDataRef: {current: {}},
    setFormData(): void {
    },
    rowTypeRef: {current: z.object()},
});

const useActionDataGridContext = (): ActionDataGridStates => {
    const context = React.useContext(ActionDataGridStatesContext);
    if (!context) {

        throw new Error('useActionDataGrid must be used within ActionDataGridProvider');
    }

    return context;
}

const formBoolean = z.enum(['true', 'false']).transform(val => val === 'true');

const ActionDataGrid = ({props}: { props: ActionDataGridProps }) => {
    const [rows, setRows] = React.useState<GridRowsProp<ActionDataGridRow>>([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [loading, setLoading] = React.useState<boolean>(props.loading);
    const originRowsRef = React.useRef<Record<GridRowId, ActionDataGridRow>>({});
    const formDataRef = React.useRef<Record<GridRowId, FormData>>({});
    const rowTypeRef = React.useRef<z.ZodObject>(z.object());
    const setFormData = React.useCallback((rowId: GridRowId, formData: FormData) => {
        formDataRef.current[rowId] = formData;
    }, [formDataRef]);
    const contextValue = React.useMemo<ActionDataGridStates>(() => ({
        rows,
        setRows,
        rowModesModel,
        setRowModesModel,
        loading,
        setLoading,
        editing: Object.values(rowModesModel).some(model => model.mode === GridRowModes.Edit),
        originRowsRef,
        formDataRef,
        setFormData,
        rowTypeRef
    }), [rows, rowModesModel, loading, setFormData]);
    const columns = React.useMemo<GridColDef[]>(() => ([
            ...props.gridProps.columns,
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                width: 130,
                cellClassName: 'actions',
                renderCell: (params) => <RowActionCell props={params} handlers={props.rowActionHandlers}/>,
            }
        ]),
        [props.gridProps.columns, props.rowActionHandlers]);

    React.useEffect(() => {
        setLoading(props.loading);
        if (props.data.length > 0) {
            const dataRows: ActionDataGridRow[] = props.data.map(d => ({...d, rowId: crypto.randomUUID(), deleted: false, edited: false}));
            setRows(dataRows);
            const originRowsObject: Record<string, ActionDataGridRow> = {};
            dataRows.forEach(row => {
                originRowsObject[row.rowId] = {...row, deleted: false, edited: false};
            });
            originRowsRef.current = originRowsObject;
            const shape: Record<string, z.ZodTypeAny> = {};
            Object.keys(props.data[0]).forEach(key => {
                if (key === 'rowId' || key === 'deleted') return;
                const value = props.data[0][key];
                if (value === null || value === undefined) {
                    shape[key] = z.string().optional();
                } else if (typeof value === 'boolean') {
                    shape[key] = formBoolean.optional();
                } else if (typeof value === 'number') {
                    shape[key] = z.coerce.number().optional();
                } else if (typeof value === 'string') {
                    shape[key] = z.string().optional();
                } else {
                    shape[key] = z.string().optional();
                }
            });
            rowTypeRef.current = z.object(shape);
        }
    }, [props.data, props.loading]);

    const processRowUpdate = (newRow: ActionDataGridRow) => {

        setRows(prevState => prevState.map(row => row.rowId === newRow.rowId ? newRow : row));

        return newRow;
    }

    return (
        <ActionDataGridStatesContext.Provider value={contextValue}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StyledDataGrid
                    {...props.gridProps}
                    loading={loading}
                    getRowId={row => row.rowId}
                    editMode="row"
                    columns={columns}
                    rows={rows}
                    rowModesModel={rowModesModel}
                    getCellClassName={(params) => params.row.deleted ? 'deleted-row' : ''}
                    showToolbar
                    slots={{
                        toolbar: ActionToolbar as GridSlots["toolbar"],
                        row: ActionRow,
                    }}
                    slotProps={{
                        toolbar: props.toolbarProps as GridToolbarProps & ToolbarPropsOverrides,
                    }}
                    processRowUpdate={(newRow) => processRowUpdate(newRow as ActionDataGridRow)}
                    onProcessRowUpdateError={error => props.gridProps.onProcessRowUpdateError?.(error)}
                />
            </LocalizationProvider>
        </ActionDataGridStatesContext.Provider>
    );
}

export {
    ActionDataGrid,
    useActionDataGridContext,
    type ActionDataGridProps,
    type ActionDataGridRow,
    type ActionDataGridStates,
};
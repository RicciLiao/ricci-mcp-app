import type {DataGridProps, GridRowId, GridRowModesModel, GridRowsProp, ToolbarPropsOverrides} from "@mui/x-data-grid";
import React, {type Dispatch, type RefObject, type SetStateAction} from "react";
import {z} from "zod";
import type {RowActionHandlers} from "./ActionCell.tsx";

export interface ActionDataGridRow {
    rowId: GridRowId;
    deleted: boolean;
    edited: boolean;
}

export interface ActionDataGridProps {
    gridProps: DataGridProps;
    rowActionHandlers: RowActionHandlers;
    data: any[];
    toolbarProps: ToolbarPropsOverrides;
    loading: boolean;
}

export interface ActionDataGridStates {
    rows: GridRowsProp<ActionDataGridRow>;
    setRows: Dispatch<SetStateAction<GridRowsProp<ActionDataGridRow>>>;
    rowModesModel: GridRowModesModel;
    setRowModesModel: Dispatch<SetStateAction<GridRowModesModel>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
    originRowsRef: RefObject<Record<GridRowId, ActionDataGridRow>>;
    formDataRef: RefObject<Record<GridRowId, FormData>>;
    setFormData: (rowId: GridRowId, formData: FormData) => void;
    rowTypeRef: RefObject<z.ZodObject>;
}

export const ActionDataGridStatesContext = React.createContext<ActionDataGridStates>({
    loading: false,
    editing: false,
    setLoading(): void {
        // placeholder for default context value
    },
    rows: [],
    setRows(): void {
        // placeholder for default context value
    },
    rowModesModel: {},
    setRowModesModel(): void {
        // placeholder for default context value
    },
    originRowsRef: {current: {} as Record<GridRowId, ActionDataGridRow>},
    formDataRef: {current: {} as Record<GridRowId, FormData>},
    setFormData(): void {
        // placeholder for default context value
    },
    rowTypeRef: {current: z.object()},
});

export const useActionDataGridContext = (): ActionDataGridStates => {

    return React.useContext(ActionDataGridStatesContext);
};


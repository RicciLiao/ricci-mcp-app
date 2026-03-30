import {ActionDataGridRow, ActionDataGridStates} from "@/components/data-grid/ActionDataGrid.tsx";
import type {GridToolbarProps} from "@mui/x-data-grid/esm/components/toolbar/GridToolbar";
import {ToolbarPropsOverrides as DataGridToolbarPropsOverrides} from "@mui/x-data-grid/esm/models/gridSlotsComponentsProps";

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides extends Partial<DataGridToolbarPropsOverrides & GridToolbarProps> {
        handleSave: (context: ActionDataGridStates) => void;
        handleRefresh: () => void;
        handleAddRecord: (newRecord: ActionDataGridRow) => ActionDataGridRow;
    }
}

import {ActionDataGridRow, useActionDataGridContext} from "@/components/data-grid/ActionDataGridContext.ts";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import {IconButton, Tooltip} from "@mui/material";
import {GridRowModes, GridSlotProps, Toolbar, ToolbarButton, ToolbarPropsOverrides} from "@mui/x-data-grid";

const ActionToolbar = (props: GridSlotProps["toolbar"] & ToolbarPropsOverrides) => {
    const actionGridContext = useActionDataGridContext();
    const editing = actionGridContext.editing
    const toolbarProps: ToolbarPropsOverrides = {
        handleSave: context => props.handleSave(context),
        handleRefresh: props.handleRefresh,
        handleAddRecord: () => {
            const id = crypto.randomUUID().toString();
            const newRecord = {rowId: id, deleted: false, edited: false};
            const valuedNewRecord = props.handleAddRecord(newRecord);
            actionGridContext.setRows(prevState => [...prevState, {...valuedNewRecord},]);
            actionGridContext.setRowModesModel(() => ({[id]: {mode: GridRowModes.Edit},}));

            return newRecord;
        },
    }

    return (
        <Toolbar>
            <Tooltip title="Save">
                <span>
                    <IconButton onClick={() => toolbarProps.handleSave(actionGridContext)} loading={actionGridContext.loading} color={"primary"} disabled={editing || actionGridContext.loading}>
                    <CheckIcon fontSize="small"/>
                </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Refresh">
                <span>
                    <ToolbarButton onClick={toolbarProps.handleRefresh} material={{color: "primary"}} disabled={editing || actionGridContext.loading}>
                    <RefreshIcon fontSize="small"/>
                </ToolbarButton>
                </span>
            </Tooltip>
            <Tooltip title="Add record">
                <span>
                    <ToolbarButton onClick={() => toolbarProps.handleAddRecord({} as ActionDataGridRow)} material={{color: "primary"}} disabled={editing || actionGridContext.loading}>
                    <AddIcon fontSize="small"/>
                </ToolbarButton>
                </span>
            </Tooltip>
        </Toolbar>
    );
};

export {ActionToolbar};
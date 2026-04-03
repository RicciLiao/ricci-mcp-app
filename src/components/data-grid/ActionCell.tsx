import {ActionDataGridRow, ActionDataGridStates, useActionDataGridContext} from "@/components/data-grid/ActionDataGridContext.ts";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import {GridActionsCell, GridActionsCellItem, GridRenderCellParams, GridRowId, GridRowModes} from "@mui/x-data-grid";
import equal from "fast-deep-equal/es6/react";
import {produce} from "immer";
import React from "react";

interface RowActionHandlers {
    handleCancelClick: (id: GridRowId, context: ActionDataGridStates) => void;
    handleDeleteClick: (id: GridRowId, context: ActionDataGridStates, newRow?: ActionDataGridRow | null) => void;
    handleEditClick: (id: GridRowId, context: ActionDataGridStates) => void;
    handleSaveClick: (id: GridRowId, context: ActionDataGridStates, newRow?: ActionDataGridRow | null) => boolean | Promise<boolean> | void | Promise<void>;
}

function convertFormDataToRowType<T extends ActionDataGridRow>(originRow: T, formData: Record<string, string>, context: ActionDataGridStates): T {
    const parsed = context.rowTypeRef.current.safeParse(formData);

    if (!parsed.success) {
        console.error('FormData validation failed:', parsed.error);
        return originRow;
    }
    return {...originRow, ...parsed.data} as T;
}


const ActionCell = ({props, handlers}: { props: GridRenderCellParams, handlers: RowActionHandlers }) => {
    const actionGridContext = useActionDataGridContext();
    const inEditRow = typeof actionGridContext.rowModesModel[props.id] !== "undefined" && actionGridContext.rowModesModel[props.id].mode === GridRowModes.Edit;
    const rowActionHandlers: RowActionHandlers = {
        handleSaveClick: async (id, context) => {
            const index = context.rows.findIndex(row => row.rowId === id);
            if (index === -1) {

                return;
            }
            (document.querySelector(`form[id="data-row-form-${id}"]`) as HTMLFormElement).requestSubmit();
            const formData = Object.fromEntries(context.formDataRef.current[id]) as Record<string, string>;
            const originRow = context.originRowsRef.current[id];
            if (!originRow) {
                const newRow = convertFormDataToRowType(context.rows[index], formData, context);
                const shouldContinue = handlers.handleSaveClick(id, context, newRow);
                if (shouldContinue === false || (shouldContinue instanceof Promise && await shouldContinue === false)) {

                    return;
                }
                context.setRows(prevState => prevState.map(row => row.rowId === newRow.rowId ? newRow : row));
            } else {
                const updatedRow = convertFormDataToRowType(originRow, formData, context);
                if (!equal(originRow, updatedRow)) {
                    updatedRow.edited = true;
                    const shouldContinue = handlers.handleSaveClick(id, context, updatedRow);
                    if (shouldContinue === false || (shouldContinue instanceof Promise && await shouldContinue === false)) {

                        return;
                    }
                    context.setRows(produce(draft => {
                        draft[index].edited = true;
                    }));
                }
            }
            context.setRowModesModel({});
        },
        handleEditClick: (id, context) => {
            handlers.handleEditClick(id, context);
            context.setRowModesModel({[id]: {mode: GridRowModes.Edit},});
        },
        handleCancelClick: (id, context) => {
            handlers.handleCancelClick(id, context);
            if (Object.keys(context.rowModesModel).length > 0) {
                context.setRowModesModel({[id]: {mode: GridRowModes.View, ignoreModifications: true},});
            }
            const index = context.rows.findIndex(row => row.rowId === id);
            if (index === -1) {

                return;
            }
            if (context.originRowsRef.current[id]) {
                if (context.rows[index].deleted) {
                    context.setRows(produce(draft => {
                        draft[index].deleted = false;
                    }));
                } else {
                    context.setRows(prevState => prevState.map(row => row.rowId === id ? context.originRowsRef.current[id] : row));
                }
            } else {
                context.setRows(produce(draft => {
                    draft.splice(index, 1);
                }));
            }
        },
        handleDeleteClick: (id, context) => {
            if (context.originRowsRef.current[id]) {
                handlers.handleDeleteClick(id, context, {...context.originRowsRef.current[id], deleted: true});
                context.setRows(produce(draft => {
                    draft.forEach(row => {
                        if (row.rowId === id) {
                            row.deleted = true;
                        }
                    });
                }));
            } else {
                handlers.handleDeleteClick(id, context, null);
                context.setRows(prevState => prevState.filter(row => row.rowId !== id));
            }
        }
    };

    const inEditActions = () => {

        return (
            <React.Fragment>
                <GridActionsCellItem
                    icon={<CheckIcon/>}
                    label="Save"
                    material={{color: "primary"}}
                    onClick={() => rowActionHandlers.handleSaveClick(props.id, actionGridContext)}
                />
                <GridActionsCellItem
                    icon={<ReplayIcon/>}
                    label="Cancel"
                    onClick={() => rowActionHandlers.handleCancelClick(props.id, actionGridContext)}
                />
            </React.Fragment>
        );
    }

    const inDeletedActions = () => {

        return (
            <GridActionsCellItem
                icon={<ReplayIcon/>}
                label="Cancel"
                onClick={() => rowActionHandlers.handleCancelClick(props.id, actionGridContext)}
                disabled={actionGridContext.editing || actionGridContext.loading}
            />
        );
    }

    const inNormalActions = () => {

        return (
            <React.Fragment>
                <GridActionsCellItem
                    icon={<EditIcon/>}
                    label="Edit"
                    onClick={() => rowActionHandlers.handleEditClick(props.id, actionGridContext)}
                    material={{color: "primary"}}
                    disabled={actionGridContext.editing || actionGridContext.loading || props.row.deleted}
                />
                {
                    props.row.edited ?
                        (<GridActionsCellItem
                            icon={<ReplayIcon/>}
                            label="Cancel"
                            onClick={() => rowActionHandlers.handleCancelClick(props.id, actionGridContext)}
                            disabled={actionGridContext.editing || actionGridContext.loading || props.row.deleted}
                        />)
                        :
                        <GridActionsCellItem
                            icon={<DeleteIcon/>}
                            label="Delete"
                            onClick={() => rowActionHandlers.handleDeleteClick(props.id, actionGridContext)}
                            material={{sx: {color: "red"}}}
                            disabled={actionGridContext.editing || actionGridContext.loading || props.row.deleted}
                        />
                }
            </React.Fragment>
        );
    }
    const cell = inEditRow ? inEditActions() : (props.row.deleted ? inDeletedActions() : inNormalActions());//NOSONAR

    return (
        <GridActionsCell {...props}>
            {cell}
        </GridActionsCell>
    );
}

export {
    ActionCell,
    type RowActionHandlers
}
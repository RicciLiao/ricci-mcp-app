import {useActionDataGridContext} from "@/components/data-grid/ActionDataGrid.tsx";
import {GridRow, GridSlotProps} from "@mui/x-data-grid";
import React from "react";

const ActionRow = (props: GridSlotProps['row']) => {
    const actionGridContext = useActionDataGridContext();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        actionGridContext.setFormData(props.rowId, new FormData(e.target as HTMLFormElement));
    }

    return (
        <form id={`data-row-form-${props.rowId}`} onSubmit={handleSubmit}>
            <GridRow {...props}/>
        </form>
    );
}

export {ActionRow}
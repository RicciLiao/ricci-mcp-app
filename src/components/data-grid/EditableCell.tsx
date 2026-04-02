import {MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {GridRenderEditCellParams, GridSingleSelectColDef, useGridApiContext} from "@mui/x-data-grid";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import React from "react";

const createEditableCell = (
    params: GridRenderEditCellParams,
    renderComponent: (params: GridRenderEditCellParams) => React.ReactNode
) => {
    if (params.colDef.editable === false) {

        return null;    // will display a normal cell
    }

    return renderComponent(params);
};

export const StringEditableCell = (params: GridRenderEditCellParams) => {
    const apiRef = useGridApiContext();

    return createEditableCell(params, params => {
        const {id, field, value} = params;
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            apiRef.current.setEditCellValue({id, field, value: newValue});
        };
        const handleBlur = () => {
            apiRef.current.stopCellEditMode({id, field});
        };

        return (
            <TextField
                value={value ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
                autoFocus
                size="small"
                fullWidth
                variant="outlined"
                name={field}
            />
        );
    });
};

export const NumberEditableCell = (params: GridRenderEditCellParams) => {
    const apiRef = useGridApiContext();

    return createEditableCell(params, params => {
        const {id, field, value} = params;
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value ? Number(event.target.value) : null;
            apiRef.current.setEditCellValue({id, field, value: newValue});
        };
        const handleBlur = () => {
            apiRef.current.stopCellEditMode({id, field});
        };

        return (
            <TextField
                type="number"
                value={value ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
                autoFocus
                size="small"
                fullWidth
                variant="outlined"
                name={field}
            />
        );
    });
};

export const SingleSelectEditableCell = (params: GridRenderEditCellParams) => {
    const apiRef = useGridApiContext();

    return createEditableCell(params, params => {
        const {id, field, value} = params;
        const colDef = params.colDef as GridSingleSelectColDef;
        const rawValueOptions = colDef.valueOptions;
        const valueOptions =
            Array.isArray(rawValueOptions) ?
                rawValueOptions
                :
                (typeof rawValueOptions === 'function' ? rawValueOptions(params) : []); //NOSONAR
        const handleChange = (event: SelectChangeEvent) => {
            const newValue = event.target.value;
            apiRef.current.setEditCellValue({id, field, value: newValue});
        };
        const handleClose = () => {
            apiRef.current.stopCellEditMode({id, field});
        };

        return (
            <Select
                value={value ?? ''}
                onChange={handleChange}
                onClose={handleClose}
                autoFocus
                fullWidth
                size="small"
                native={false}
                name={field}
            >
                {valueOptions.map((option, index) => {
                    let optionValue: string | number;
                    let optionLabel: string;
                    if (typeof option === 'object' && 'value' in option && 'label' in option) {
                        optionValue = option.value;
                        optionLabel = option.label;
                    } else {
                        optionValue = option as string | number;
                        optionLabel = option as string;
                    }
                    return (
                        <MenuItem key={`${optionValue}-${index}`} value={optionValue}>
                            {optionLabel}
                        </MenuItem>
                    );
                })}
            </Select>
        );
    });
};

export const DateTimeEditableCell = (params: GridRenderEditCellParams) => {
    const apiRef = useGridApiContext();

    return createEditableCell(params, params => {
        const {id, field, value} = params;
        const parsedValue = typeof value === 'number' && value > 0 ? new Date(value) : null;
        const handleChange = (newValue: Date | null) => {
            const timestamp = newValue ? newValue.getTime() : null;
            apiRef.current.setEditCellValue({id, field, value: timestamp});
        };
        const handleClose = () => {
            apiRef.current.stopCellEditMode({id, field});
        };

        return (
            <DateTimePicker
                value={parsedValue}
                onChange={handleChange}
                onClose={handleClose}
                slotProps={{
                    textField: {
                        size: "small",
                        fullWidth: true,
                        autoFocus: true,
                    },
                }}
                name={field}
            />
        );
    });
};

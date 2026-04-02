import {useAppSelector} from "@app/hooks.ts";
import {Theme, ThemeProvider, ThemeProviderProps} from "@mui/material";
import {defaultTheme} from "@theme/appTheme.ts";
import React from "react";

const AppThemeProvider = ({children, theme, focus, ...props}: { children?: React.ReactNode, theme: Theme, focus?: boolean, props?: ThemeProviderProps<Theme> }) => {
    const appThemeStatus = useAppSelector((state) => state.appTheme.customTheme);
    let activeTheme = appThemeStatus ? theme : defaultTheme;
    activeTheme = focus ? theme : activeTheme;

    return (
        <ThemeProvider theme={activeTheme} {...props}>
            {children}
        </ThemeProvider>
    )
}


export {AppThemeProvider};
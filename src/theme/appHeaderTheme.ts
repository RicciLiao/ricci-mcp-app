import {createTheme} from "@mui/material";
import {appTheme} from "@theme/appTheme";

const appHeaderTheme = createTheme(appTheme,
    {
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: "white"
                    }
                }
            },
        }
    });


export {appHeaderTheme};
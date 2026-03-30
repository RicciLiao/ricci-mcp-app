import {AppThemeProvider} from "@/components/AppThemeProvider.tsx";
import {HeaderMenu} from "@/components/menu/HeaderMenu.tsx";
import {featuresMenu} from "@common/featuresMenu.tsx";
import {AppMenuItem} from "@interfaces/AppMenuItem.ts";
import {Backdrop, Box} from "@mui/material";
import {appMenuTheme} from "@theme/appMenuTheme.ts";
import React, {Dispatch, RefObject, SetStateAction} from "react";

interface AppMenuContextType {
    activeMenuPath: string[];
    setActiveMenuPath: Dispatch<SetStateAction<string[]>>;
    closeAllMenus: () => void;
    activeDelayer: RefObject<NodeJS.Timeout | null>
}

const AppMenuContext = React.createContext<AppMenuContextType>({
    activeMenuPath: [],
    setActiveMenuPath: () => {
    },
    closeAllMenus: () => {
    },
    activeDelayer: {
        current: null
    },
});

const MenuProvider = ({children}: { children: React.ReactNode }) => {
    const [activeMenuPath, setActiveMenuPath] = React.useState<string[]>([]);
    const activeDelayer = React.useRef<NodeJS.Timeout | null>(null);
    const closeAllMenus = React.useCallback(() => {
        if (activeDelayer.current) {
            clearTimeout(activeDelayer.current);
            activeDelayer.current = null;
        }
        setActiveMenuPath([]);
    }, [setActiveMenuPath]);

    const context = React.useMemo<AppMenuContextType>(() => ({
        activeMenuPath, setActiveMenuPath, closeAllMenus, activeDelayer
    }), [activeMenuPath, closeAllMenus]);

    return (
        <AppMenuContext.Provider value={context}>
            {children}
            <Backdrop
                open={activeMenuPath.length > 0}
                onClick={closeAllMenus}
                sx={(theme) => (
                    {
                        backgroundColor: "rgba(0,0,0,0)",
                        zIndex: theme.zIndex.drawer + 1,
                        top: 64
                    }
                )}
            />
        </AppMenuContext.Provider>
    );
};

const HeaderMenus = ({menus}: { menus: AppMenuItem[] }) => {

    return (
        <Box sx={{display: "flex", alignItems: "center"}}>
            {menus.map(menu => (
                <HeaderMenu key={menu.key} menu={menu}/>
            ))}
        </Box>
    );
};

const AppMenu = () => {

    return (
        <AppThemeProvider theme={appMenuTheme}>
            <MenuProvider>
                <Box>
                    <HeaderMenus menus={[featuresMenu]}/>
                </Box>
            </MenuProvider>
        </AppThemeProvider>
    );
}


export {
    AppMenu,
    type AppMenuContextType,
    AppMenuContext
};
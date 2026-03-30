import './App.css'
import {AppHeader} from "@/components/AppHeader.tsx";
import {AppSnackbarProvider} from "@/components/AppSnackbarProvider.tsx";
import {AppThemeProvider} from "@/components/AppThemeProvider.tsx";
import {appTheme} from "@theme/appTheme.ts";
import {Outlet} from "react-router-dom";


const App = () => {

    return (<AppSection/>);
}

const AppSection = () => {

    return (
        <AppThemeProvider theme={appTheme}>
            <section>
                <AppSnackbarProvider/>
                <AppHeader/>
                <Outlet/>
            </section>
        </AppThemeProvider>
    );
};

export default App

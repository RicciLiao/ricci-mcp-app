import {XResponseCodeMiddleware} from "@app/middleware/x/XResponseCodeMiddleware.ts";
import {XResponseRTKMiddleware} from "@app/middleware/x/XResponseRTKMiddleware.ts";
import {apiSlice} from "@app/slice/api/apiSlice.ts";
import appSnackbarSlice from "@app/slice/appSnackbarSlice.ts";
import appThemeSlice from "@app/slice/appThemeSlice.ts";
import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        appTheme: appThemeSlice,
        appSnackbar: appSnackbarSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(new XResponseCodeMiddleware().build())
            .concat(new XResponseRTKMiddleware().build())
});

export {store};
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;

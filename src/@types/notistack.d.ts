import {AppAlertInterface} from "@/components/AppSnackbarProvider.tsx";

declare module "notistack" {
    interface VariantOverrides {
        alert: {
            data: AppAlertInterface
        };
    }
}
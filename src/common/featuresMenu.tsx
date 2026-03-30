import {McpProviderInfoComp} from "@features/McpProviderInfoComp.tsx";
import {AppMenuItem} from "@interfaces/AppMenuItem.ts";

const featuresMenu: AppMenuItem =
    {
        key: "Features",
        label: "Features",
        subMenuList: [
            {
                key: "info",
                path: "/info",
                label: "Info",
                sort: 0,
                component: McpProviderInfoComp,
            },
        ]
    }
;


export {featuresMenu};
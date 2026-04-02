import {format} from "date-fns";

const appUtils = {

    number2DateFormat: (timestamp: number | null | undefined, formatter: string): string | null => {
        if (typeof timestamp === "number") {

            return format(timestamp, formatter)
        }

        return null;
    },
    number2Date: (timestamp: number | null | undefined): Date | null => {
        if (typeof timestamp === "number") {

            return new Date(timestamp)
        }

        return null;
    },
    date2DateFormat: (timestamp: Date | null | undefined, formatter: string): string | null => {
        if (timestamp) {

            return format(timestamp, formatter)
        }

        return null;
    },

}

export {
    appUtils
}
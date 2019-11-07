enum PeriodTypes {
    NUMBER = 1,
    COLON_SEPARATED_INDEX = 2,
    INDEX_AT_END = 3,
    MONTH_STRING_SH = 4,
    MONTH_STRING_LG = 5,
    WEEK_STRING_SH  = 6,
    WEEK_STRING_LG  = 7,
    ISO_8601_DATE   = 8,
    TEXT = 9
}

export class PeriodParser {
    
    constructor(){

    }

    private static monthWeekFormats = {
        "MONTH_STRING_SH": [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec"
        ],
        "MONTH_STRING_LG": [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december"
        ],
        "WEEK_STRING_SH": ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        "WEEK_STRING_LG": [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ]
    };

    private static checkMonthWeekFormat(str: string) {
        if(typeof str !== "string") return;

        const mwFormats = PeriodParser.monthWeekFormats;
        const formatTypes = Object.keys(mwFormats);
        let periodFormat: string;
        let matchFound: boolean = false;
        str = str.toLowerCase();

        for (let i = 0; i < formatTypes.length; i++) {
            matchFound = mwFormats[formatTypes[i]].some((item: string) => {
                return item === str;
            });

            if (matchFound) {
                periodFormat = formatTypes[i];
                break;
            }
        }
        return periodFormat;
    }

    private static getPeriodType(period: string | number) {
        if (typeof period === "number") {
            return PeriodTypes.NUMBER;
        }

        let periodType = PeriodParser.checkMonthWeekFormat(period);
        if (periodType) {
            return PeriodTypes[periodType];
        }

        return PeriodTypes.TEXT;
    }

    private static processNumber(periods: number[]): number[] {
        const sortedPeriod = periods.slice().sort((a, b) => a - b);
        return sortedPeriod;
    }

    private static processMonthWeek(
        periods: string[],
        periodType : number
    ): any[] {
        return PeriodParser.monthWeekFormats[PeriodTypes[periodType]];
    }

    private static processTextPeriod(periods: string[]) : any[] {
        const src = periods.slice().sort();
        return src;
    }

     private static getSortedIndexes(
        periods: string[] | number[],
        periodType: number
    ): number[] {
        switch (periodType) {
            case PeriodTypes.NUMBER:
                return PeriodParser.processNumber(periods as number[]);

            case PeriodTypes.MONTH_STRING_LG:
            case PeriodTypes.MONTH_STRING_SH:
            case PeriodTypes.WEEK_STRING_LG:
            case PeriodTypes.WEEK_STRING_SH:
                return PeriodParser.processMonthWeek(periods as string[] , periodType);

            case PeriodTypes.TEXT:
                return PeriodParser.processTextPeriod(periods as string[]);

        }
    }

    public getSortedOrder(periods: string[]) {
        const period = periods[0];
        let periodType = PeriodParser.getPeriodType(period);  
        return PeriodParser.getSortedIndexes(periods,periodType)
    }

}


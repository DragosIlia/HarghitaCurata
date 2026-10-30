/* eslint-disable @typescript-eslint/naming-convention */
export interface ICalendar {
    calendar: ICalendarData;
    fractions: ICalendarFractions[];
}

export interface ICalendarData {
    id: number;
    name: string;
    state: number;
    updateDate: Date;
}

export interface ICalendarFractionInfo {
    id: number;
    name: string;
    nameGb: string;
    nameHu: string;
    color: string;
    details: string;
    detailsGb: string;
    detailsHu: string;
    special: boolean;
}

export interface ICalendarEvent {
    name: string;
    date: Date;
    color: string;
}

export interface ICalendarFractions {
    id: number;
    startDate: Date;
    endDate: Date;
    fractionType: ICalendarFractionInfo;
    repeat: number;
    isWeekend: boolean;
    daysOfWeekMo: boolean;
    daysOfWeekTu: boolean;
    daysOfWeekWe: boolean;
    daysOfWeekTh: boolean;
    daysOfWeekFr: boolean;
    daysOfWeekSa: boolean;
    daysOfWeekSu: boolean;
    selectedWeek: number;
    selectedDay: number;
    frequency: number;
}


export interface ICalendarPeriod {
    date: Date;
    week: number;
}

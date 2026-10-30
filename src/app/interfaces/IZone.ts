import { ICity } from './ICity';
import { ICalendarData } from './ICalendar';

export interface IZone {
    id: number;
    zoneNumber: number;
    city: ICity;
    calendar: ICalendarData;
}


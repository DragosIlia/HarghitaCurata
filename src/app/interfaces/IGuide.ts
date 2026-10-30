import { ICalendarFractionInfo } from './ICalendar';

export interface IGuide {
    id: number;
    name: string;
    nameGb: string;
    nameHu: string;
    type: IGuideType;
    material: string;
    isRecycled: boolean;
    fraction: ICalendarFractionInfo;
    details: string;
    detailsGb: string;
    detailsHu: string;
    link: string;
    state: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IGuideType {
    id: number;
    name: string;
}

export interface IGuideDetails {
    item: IGuide;
    language: string;
}

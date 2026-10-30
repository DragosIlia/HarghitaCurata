/* eslint-disable @typescript-eslint/naming-convention */
export interface INotification {
    [date: string]: INotificationData[];
}

export interface INotificationData {
    date: Date;
    time: string;
    type: NotificationType;
    title: string;
    subtitle: string;
    content: string;
}

export enum NotificationType {
    Info = 0,
    Success = 1,
    Danger = 2
}


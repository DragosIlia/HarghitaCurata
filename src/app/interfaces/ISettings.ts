/* eslint-disable @typescript-eslint/naming-convention */
export interface ISettings {
    [divider: string]: ISettingsData[];
}

export interface ISettingsData {
    name: string;
    type: Settings;
    auth: boolean;
    canSeeWithoutAuth: boolean;
}

export enum Settings {
    Details,
    Addresses,
    RequestTruck,
    SendMessage,
    Language,
    Delete,
    Support,
    Feedback,
    Curiosities,
    FAQ,
    Terms,
    Privacy,
    Logout
}


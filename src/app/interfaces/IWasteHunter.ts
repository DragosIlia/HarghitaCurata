export interface IWasteHunter {
    id: number;
    gpsLatitude: number;
    gpsLongitude: number;
    description: string;
    insertDate: Date;
    state: number;
    location: string;
}

export interface IWasteHunterAdd {
    gpsLatitude: number;
    gpsLongitude: number;
    address?: string;
    details: string;
    betweenTwoLocalities: boolean;
}

export interface IWasteHunterCategory {
    size: string;
    name: string;
    selected: boolean;
}

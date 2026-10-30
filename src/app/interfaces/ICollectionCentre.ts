export interface ICollectionCentre {
    id: number;
    gpsLatitude: number;
    gpsLongitude: number;
    hours: string;
    email: string;
    name: string;
    nameGb: string;
    nameHu: string;
    description: string;
    descriptionGb: string;
    descriptionHu: string;
    phoneNumber: string;
    street: string;
    streetNumber: string;
    website: string;
    fractions: string;
    createdAt: Date;
    updatedAt: Date;
    distance: number;
}

export interface ICollectionCentreFraction {
    id: number;
    name: string;
    nameGb: string;
    nameHu: string;
    color: string;
    details: string;
    detailsGb: string;
    detailsHu: string;
    selected: boolean;
    special: boolean;
}

export interface ICollectionCentreItem {
    id: number;
    name: string;
    nameGb: string;
    nameHu: string;
    description: string;
    descriptionGb: string;
    descriptionHu: string;
}

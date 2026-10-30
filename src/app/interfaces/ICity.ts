import { IUat } from './IUat';

export interface ICity {
    id: number;
    name: string;
    fullName: string;
    subCity: boolean;
    hasMoreThanOneZone: boolean;
    uat: IUat;
}

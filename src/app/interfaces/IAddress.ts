import { IOperator } from './IOperator';
import { IZone } from './IZone';

export interface IAddress {
    id: number;
    city: string;
    street: string;
    streetNumber: string;
    main: boolean;
    liveInBlock: boolean;
    zone: IZone;
    operator: IOperator;
}


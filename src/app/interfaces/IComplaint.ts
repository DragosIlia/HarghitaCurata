import { IAddress } from './IAddress';

export interface IComplaint {
    id: number;
    title: string;
    content: string;
    sendDate: Date;
    state: number;
    responseMessage: string;
    responseDate: Date;
    read: boolean;
    address: IAddress;
}

/* eslint-disable @typescript-eslint/naming-convention */
export interface IUpdate {
    Maintenance: boolean;
    Versioning: IVersion;
}

export interface IVersion {
    Current: string;
    Enabled: boolean;
}


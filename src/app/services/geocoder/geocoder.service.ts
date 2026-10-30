import { Injectable } from '@angular/core';
import { NativeGeocoder } from '@capgo/capacitor-nativegeocoder';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class GeocoderService {
    async getReverseGeocoder(latitude: number, longitude: number) {
        const result = await NativeGeocoder.reverseGeocode({ latitude, longitude, apiKey: environment.mapKey });
        return result.addresses;
    }

    // getFormattedReverseGeocoder(latitude: number, longitude: number) {
    //     // 6, Strada Profesor Ion Maiorescu, Bucuresti, Municipiul București, Sector 2, 030167, Romania
    //     // areasOfInterest, thoroughfare, administrativeArea, locality, subLocality, postalCode, countryName
    //     return this.getReverseGeocoder(latitude.toString(), longitude.toString()).then((result: NativeGeocoderResult[]) => {
    //         if (result !== null && result !== undefined && result.length > 0) {
    //             const address = result[0];
    //             const addressResult =
    //                 (address?.areasOfInterest ? address?.areasOfInterest + ', ' : '') +
    //                 (address?.thoroughfare ? address?.thoroughfare + ' ' : '') +
    //                 (address?.administrativeArea ? address?.administrativeArea + ', ' : '') +
    //                 (address?.locality ? address?.locality + ', ' : '') +
    //                 (address?.subLocality ? address?.subLocality + ', ' : '') +
    //                 (address?.postalCode ? address?.postalCode + ', ' : '') +
    //                 (address?.countryName ? address?.countryName : '');
    //             return addressResult;
    //         }
    //         return `${latitude}, ${longitude}`;
    //     });
    // }

    async getForwardGeocoder(addressString: string) {
        const result = await NativeGeocoder.forwardGeocode({ addressString, apiKey: environment.mapKey });
        return result.addresses;
    }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAddress } from '../../interfaces/IAddress';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserDetailsService {
    public addresses: IAddress[] = [];
    public mainAddress: BehaviorSubject<IAddress> = new BehaviorSubject(null);
    constructor(private http: HttpClient) { }

    getAddresses() {
        console.log('Getting addresses from API.');
        return this.http.get<IAddress[]>(environment.apiUrl + 'account/get-addresses');
    }

    addAddress(model: any) {
        return this.http.post(environment.apiUrl + 'account/add-address', model).pipe(catchError(model));
    }

    saveDetails(model: any) {
        return this.http.post(environment.apiUrl + 'account/save-details', model);
    }

    deleteAddress(id: number) {
        return this.http.delete(environment.apiUrl + 'account/delete-address/' + id);
    }

    setActiveAddress(model: any) {
        return this.http.post(environment.apiUrl + 'account/set-active-address', model);
    }

    resetAddresses() {
        this.setAddresses([]);
        this.setMainAddress(null);
    }

    setAddresses(addresses: IAddress[]) {
        this.addresses = addresses;
    }
    getAllAddresses() {
        return this.addresses;
    }
    setMainAddress(address: IAddress) {
        this.mainAddress.next(address);
    }
    getMainAddress() {
        return this.mainAddress;
    }
}

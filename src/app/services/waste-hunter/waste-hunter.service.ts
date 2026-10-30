import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IWasteHunter, IWasteHunterAdd } from '../../interfaces/IWasteHunter';

@Injectable({
    providedIn: 'root'
})
export class WasteHunterService {

    constructor(private http: HttpClient) { }

    getLastEntries(id: number) {
        return this.http.post<IWasteHunter[]>(environment.apiUrl + 'wasteHunter/get-last-entries', id);
    }

    addWasteHunterEntry(formData: FormData) {
        return this.http.post<IWasteHunter>(environment.apiUrl + 'wasteHunter/upload-image', formData);
    }

    getImage(id: number) {
        return this.http.post(environment.apiUrl + 'wasteHunter/get-image', id, { responseType: 'text'});
    }
}

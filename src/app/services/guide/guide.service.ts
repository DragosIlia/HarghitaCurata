import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IGuide } from '../../interfaces/IGuide';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GuideService {

    constructor(private http: HttpClient) { }

    getItems() {
        console.log('Getting guide from API.');
        return this.http.get<IGuide[]>(environment.apiUrl + 'guide/get');
    }
}

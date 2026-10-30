import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TruckRequestService {

    constructor(private http: HttpClient) { }

    getFileFromAddress(model: any) {
        return this.http.post(environment.apiUrl + 'truck/get-file', model, { responseType: 'blob'}).pipe(catchError(model));
    }
}

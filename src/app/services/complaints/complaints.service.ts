import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IComplaint } from 'src/app/interfaces/IComplaint';

@Injectable({
    providedIn: 'root'
})
export class ComplaintsService {

    constructor(private http: HttpClient) { }

    sendMessage(model: any) {
        return this.http.post(environment.apiUrl + 'complaint/send', model).pipe(catchError(model));
    }

    getComplaints() {
        return this.http.get<IComplaint[]>(environment.apiUrl + 'complaint/get-user-complaints');
    }

    readComplaint(id: number) {
        return this.http.post<IComplaint>(environment.apiUrl + 'complaint/read-complaint', id);
    }
}

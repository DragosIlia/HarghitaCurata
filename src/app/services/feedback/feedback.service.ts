import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {

    constructor(private http: HttpClient) { }

    sendFeedback(model: any) {
        return this.http.post(environment.apiUrl + 'feedback/send', model).pipe(catchError(model));
    }
}

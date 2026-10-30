/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { IQuestion } from 'src/app/interfaces/IQuestion';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FaqService {
    constructor(private http: HttpClient) { }

    getQuestions() {
        console.log('Getting frequently asked questions from API.');
        return this.http.get<IQuestion[]>(environment.apiUrl + 'question/get');
    }
}

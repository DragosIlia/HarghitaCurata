import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { INotification, INotificationData } from '../../interfaces/INotification';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private http: HttpClient) { }

    getNotifications() {
        console.log('Getting notifications from API.');
        return this.http.get<INotificationData[]>(environment.apiUrl + 'notification/get');
    }
}

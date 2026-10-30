/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IUser } from '../../interfaces/IUser';

@Injectable({
    providedIn: 'root'
})
export class FcmService {
    public fcmToken: string = null;
    public userDetails: IUser = null;
    constructor(private authenticationService: AuthenticationService, private http: HttpClient) { }

    async registerNotifications() {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            return;
        }

        await PushNotifications.register();
    }

    async initPush() {
        if (Capacitor.getPlatform() === 'web') return;

        await this.addListeners();
        try {
            await this.registerNotifications();
        } catch (error) {
            console.warn('Push notifications are not configured on this build.', error);
        }
    }

    async addListeners() {
        PushNotifications.addListener('registration', (token: Token) => {
            console.log('My token: ' + JSON.stringify(token));

            this.authenticationService.isAuthenticated.subscribe(async (isLogged) => {
                if(isLogged) this.getUserDetails(token);
                else {
                    this.userDetails = null;
                    this.fcmToken = null;
                }
            });
        });

        PushNotifications.addListener('registrationError', (error: any) => {
            console.log('Error on registration: ' + JSON.stringify(error));
        });

        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
            console.log('Push received: ' + JSON.stringify(notification));
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
            const data = notification.notification.data;
            console.log('Push action performed: ' + JSON.stringify(notification.notification));
        });
    }

    getUserDetails(token: Token) {
        this.authenticationService.currentUser.subscribe(userDetails => {
            this.userDetails = userDetails;
            if(this.userDetails !== null)
                this.setterToken(token.value, this.userDetails.id);
        });
    }

    setterToken(token: string, id: number) {
        this.setToken(token, this.userDetails.id).subscribe(
            (res: any) => {
                console.log('Setting succesfully token in DB... ', res.token);
                this.fcmToken = res.token;
            },
            (err) => {
                console.log('Error setting token in DB');
                console.log(JSON.stringify(err));
            }
        );
    }

    setToken(tokenValue: string, idValue: number) {
        return this.http.post(environment.apiUrl + 'push/set-token', { token: tokenValue, userId: idValue });
    }

    getToken() {
        return this.fcmToken;
    }
}

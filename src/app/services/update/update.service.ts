/* eslint-disable curly */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular/lazy';
import { IUpdate } from '../../interfaces/IUpdate';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { NativeMarket } from '@capacitor-community/native-market';
import { App } from '@capacitor/app';
import config from '../../../../capacitor.config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UpdateService {
    public infoAlert: HTMLIonAlertElement = null;
    public currentVersion: string = null;
    public currentVersionCode: string | number = null;
    constructor(private alertCtrl: AlertController, private translateService: TranslateService, private http: HttpClient, private platform: Platform) { }

    async checkForUpdate() {
        if (Capacitor.isNativePlatform()) {
            const appInfo = await App.getInfo();
            this.currentVersion = appInfo.version;
            this.currentVersionCode = appInfo.build;
        }
        try {
            this.http.get<IUpdate>(environment.apiUrl + 'version/get').subscribe(async (info: IUpdate) => {
                if (info.Maintenance) { // Enable maintenance
                    this.presentAlert(this.translateService.instant('Maintenance.Title'), this.translateService.instant('Maintenance.Content'));
                } else if (info.Versioning.Enabled) { // New Version
                    if(this.currentVersion === null) return;
                    const splittedVersion = this.currentVersion.split('.');
                    const serverVersion = info.Versioning.Current.split('.');

                    if (serverVersion[0] > splittedVersion[0] || serverVersion[1] > splittedVersion[1] || serverVersion[2] > splittedVersion[2]) {
                        this.presentAlert(this.translateService.instant('Versioning.Update.Title'), this.translateService.instant('Versioning.Update.Content'), this.translateService.instant('Versioning.Update.Button'));
                    }

                    // Disable for the moment for minor, just enable major.
                    // if (serverVersion[0] > splittedVersion[0]) {
                    //     this.presentAlert(this.translateService.instant('Versioning.Major.Title'), this.translateService.instant('Versioning.Major.Content'), this.translateService.instant('Versioning.Major.Button'));
                    // } else if (serverVersion[1] > splittedVersion[1]) {
                    //     this.presentAlert(this.translateService.instant('Versioning.Minor.Title'), this.translateService.instant('Versioning.Minor.Content'), this.translateService.instant('Versioning.Minor.Button'), true);
                    // }
                }
            });
        } catch (e) {
            this.presentAlert(this.translateService.instant('Maintenance.Title'), this.translateService.instant('Maintenance.Content'));
            console.log(e);
        }
    }

    openStore() {
        const appId = (Capacitor.getPlatform() === 'android') ? config.appId : '';
        if (!appId) return;
        console.log('Opening store on application... ', appId);
        NativeMarket.openStoreListing({ appId, });
    }

    async presentAlert(header, message, buttonText = '', backdropDismiss = false) {
        const buttons = [];

        if (buttonText !== '') {
            buttons.push({
                text: buttonText,
                handler: () => {
                    this.openStore();
                    if (!backdropDismiss)
                        return false;
                }
            });
        }

        if (backdropDismiss) {
            buttons.push({
                text: this.translateService.instant('Versioning.Cancel'),
                role: 'cancel'
            });
        }

        this.infoAlert = await this.alertCtrl.create({ header, message, buttons, backdropDismiss, cssClass: 'versioning-alert' });
        await this.infoAlert.present();
    }

    closeAlert() {
        if (this.infoAlert === null) return;
        this.alertCtrl.dismiss();
        this.infoAlert = null;
    }

    getAppVersion() {
        return this.currentVersion;
    }

    getAppVersionCode() {
        return this.currentVersionCode;
    }
}

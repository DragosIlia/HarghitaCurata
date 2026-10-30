/* eslint-disable curly */
/* eslint-disable max-len */
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Platform } from '@ionic/angular/lazy';
import { LanguageService } from './services/language/language.service';
import { LocationService } from './services/location/location.service';
import { FcmService } from './services/fcm/fcm.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})

export class AppComponent {


    constructor(public languageService: LanguageService, public platform: Platform, private locationService: LocationService, private fcmService: FcmService) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(async () => {
            await this.setStatusBar();
            await this.languageService.initialize();
            await this.locationService.checkLocation();
            await this.fcmService.initPush();
        });
    }

    async setStatusBar() {
        if(Capacitor.getPlatform() === 'web') return;

        await StatusBar.setStyle({ style: Style.Light });
    }
}

/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { LoadingController } from '@ionic/angular/lazy';
import { StorageService } from '../../services/storage/storage.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ONBOARIDNG_KEY } from '../../guards/welcome/welcome.guard';
import { environment } from '../../../environments/environment';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
    public applicationName: string = environment.appName;

    constructor(private storageService: StorageService, private router: Router) { }

    ngOnInit() { }

    async assignBoard() {
        await this.storageService.setStorageKey(ONBOARIDNG_KEY, 'true');
        this.router.navigateByUrl('/menu', { replaceUrl: true });
    }
}

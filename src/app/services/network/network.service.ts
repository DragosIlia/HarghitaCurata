/* eslint-disable curly */
import { Injectable, NgZone } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';
import { UpdateService } from '../update/update.service';

@Injectable({
    providedIn: 'root'
})

export class NetworkService {
    public networkListener: PluginListenerHandle;
    public internetStatus: boolean;

    constructor(private ngZone: NgZone, private router: Router, private updateService: UpdateService) { }

    async checkInternet() {
        this.networkListener = await Network.addListener('networkStatusChange', status => {
            console.log('Network status changed: ', status);
            this.ngZone.run(() => {
                this.changeStatus(status?.connected);
            });
        });
        const internetStatus = await Network.getStatus();
        this.changeStatus(internetStatus?.connected);
    }

    removeInternetListener() {
        if (this.networkListener === null || this.networkListener === undefined) return;
        this.networkListener.remove();
    }

    async changeStatus(status) {
        if (this.internetStatus === status) return;
        this.internetStatus = status;
        if (!this.internetStatus) {
            this.updateService.closeAlert();
            this.router.navigateByUrl('/network', { replaceUrl: true });
        }
        else {
            this.router.navigateByUrl('/', { replaceUrl: true });
            setTimeout(() => { this.updateService.checkForUpdate(); }, 1000);
        }
    }

    getStatus() {
        return this.internetStatus;
    }
}

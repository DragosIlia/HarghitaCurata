import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NetworkService } from '../network/network.service';
import { ToastService } from '../toast/toast.service';

@Injectable({ providedIn: 'root' })
export class LocationService {
    public preciseNeeded = new BehaviorSubject<boolean>(false);

    constructor(
        private router: Router,
        private toastService: ToastService,
        private translateService: TranslateService,
        private networkService: NetworkService
    ) { }

    getCurrentLocation() {
        return Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
    }

    noLocation() {
        void this.router.navigateByUrl('/location', { replaceUrl: true });
    }

    async getLocationEnabled(): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;
        try {
            const status = await Geolocation.checkPermissions();
            return status.location !== 'denied';
        } catch {
            return false;
        }
    }

    async getLocationAuthorized(): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;
        try {
            const status = await Geolocation.checkPermissions();
            return status.location === 'granted';
        } catch {
            return false;
        }
    }

    async checkLocation() {
        await this.enableLocation(true);
    }

    async enableLocation(fromStart = false) {
        try {
            if (Capacitor.isNativePlatform()) {
                const permission = await Geolocation.requestPermissions();
                if (permission.location !== 'granted') {
                    this.preciseNeeded.next(true);
                    this.showLocationError();
                    if (fromStart) this.noLocation();
                    return;
                }
            }

            await this.getCurrentLocation();
            this.preciseNeeded.next(false);
            await this.router.navigateByUrl('/', { replaceUrl: true });
            this.networkService.checkInternet();
        } catch {
            this.preciseNeeded.next(true);
            this.showLocationError();
            this.noLocation();
        }
    }

    private showLocationError() {
        this.toastService.showToast(this.translateService.instant('Location.PreciseNeeded'), 'alert-circle-outline', 3000, 'top', 'danger');
    }
}

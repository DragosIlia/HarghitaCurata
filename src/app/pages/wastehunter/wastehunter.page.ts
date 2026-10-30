/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { IWasteHunter } from 'src/app/interfaces/IWasteHunter';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { WasteHunterService } from '../../services/waste-hunter/waste-hunter.service';
import { Subscription } from 'rxjs';
import { IWasteHunterAdd, IWasteHunterCategory } from '../../interfaces/IWasteHunter';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { NativeGeocoder } from '@capgo/capacitor-nativegeocoder';
import { environment } from 'src/environments/environment';
import { LocationService } from '../../services/location/location.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../services/loader/loader.service';
import { IUser } from 'src/app/interfaces/IUser';
import { WastehunterDetailsPage } from '../wastehunter-details/wastehunter-details.page';
import { CentreService } from '../../services/centre/centre.service';
import { ModalService } from '../../services/modal/modal.service';
import { LanguageService } from '../../services/language/language.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-wastehunter',
    templateUrl: './wastehunter.page.html',
    styleUrls: ['./wastehunter.page.scss'],
})
export class WastehunterPage {
    @ViewChild('previewMap') mapRef: ElementRef;
    public previewMap: GoogleMap = null;
    public wasteHunterEntries: IWasteHunter[] = null;
    public wasteHunterSubscribe: Subscription = null;

    public wasteReporting = false;
    public wastePhoto: Photo = null;
    public wasteLocation: IWasteHunterAdd = null;
    public oldMarker: string = null;
    public currentUser: IUser = null;

    public wasteFits: IWasteHunterCategory[] = [
        {size: 'Bag', name: 'Tabs.WasteHunter.Add.Fit.Bag', selected: false},
        {size: 'Wheelbarrow', name: 'Tabs.WasteHunter.Add.Fit.Wheelbarrow', selected: false},
        {size: 'Car', name: 'Tabs.WasteHunter.Add.Fit.Car', selected: false},
    ];

    public locale: string = 'en';

    constructor(private centreService: CentreService, private authService: AuthenticationService, private languageService: LanguageService, private wasteHunterService: WasteHunterService, private locationService: LocationService, private toastService: ToastService, private translateService: TranslateService, private loaderService: LoaderService, private modalService: ModalService) { }

    ionViewDidEnter() {
        this.getLocaleData();
        this.getLastEntries();
    }

    ionViewDidLeave() {
        this.resetLastEntries();
        this.resetRecording();
    }

    getLocaleData() {
        this.languageService.getLocale().subscribe(res => {
            this.locale = res;
        });
    }

    resetRecording() {
        this.wasteLocation = null;
        this.wasteReporting = false;
        this.wastePhoto = null;
        this.wasteFits.forEach(fit => fit.selected = false);
        this.deletePreviewMap();
    }

    deletePreviewMap() {
        if (!this.previewMap) return;
        this.previewMap.removeMarker(this.oldMarker);
        this.previewMap.destroy();
        this.previewMap = null;
    }

    resetLastEntries() {
        if (this.wasteHunterSubscribe) {
            this.wasteHunterSubscribe.unsubscribe();
            this.wasteHunterSubscribe = null;
        }
        this.wasteHunterEntries = null;
    }

    handleRefresh(event) {
        setTimeout(() => {
            this.getLastEntries();
            event.target.complete();
        }, 2000);
    };

    getLastEntries() {
        this.authService.getUserDetails().subscribe(user => {
            this.currentUser = user;
            if(this.currentUser !== null && this.currentUser !== undefined)
                this.lastEntries();
        });
    }

    lastEntries() {
        if(!this.currentUser) return;

        this.wasteHunterSubscribe = this.wasteHunterService.getLastEntries(this.currentUser.id).subscribe(data => {
            this.wasteHunterEntries = data;
        });
    }

    async recordDump() {
        try {
            this.wastePhoto = await Camera.getPhoto({
                quality: 90,
                source: CameraSource.Camera,
                allowEditing: false,
                resultType: CameraResultType.Uri
            });
        } catch (e) {
            console.log(e);
        }
        if (this.wastePhoto !== null) this.startRecording();
    }

    async readAsBase64(photo: Photo) {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        return await this.convertBlobToBase64(blob) as string;
    }

    convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    async startRecording() {
        const base64Data = await this.readAsBase64(this.wastePhoto);
        this.wastePhoto.webPath = base64Data;
        this.wasteReporting = true;
        this.getCurrentLocation();
    }

    async getCurrentLocation() {
        const locationEnabled = await this.locationService.getLocationEnabled();
        if (!locationEnabled) {
            this.locationService.noLocation();
            return;
        }

        const locationAuthorized = await this.locationService.getLocationAuthorized();
        if (!locationAuthorized) {
            this.resetRecording();
            this.toastService.showToast(this.translateService.instant('Location.PreciseNeeded'), 'alert-circle-outline', 3000, 'top', 'danger');
            return;
        }
        const coordinates = await this.locationService.getCurrentLocation();
        NativeGeocoder.reverseGeocode({ latitude: coordinates.coords.latitude, longitude: coordinates.coords.longitude, useLocale: true, maxResults: 5, apiKey: environment.mapKey }).then(({ addresses: result }) => {
            if (result !== null && result !== undefined && result.length > 0) {
                const address = result[0];
                const addressResult =
                    (address.thoroughfare ? address.thoroughfare + ' ' : '') +
                    (address.subThoroughfare ? address.subThoroughfare + ', ' : '') +
                    (address.locality ? address.locality + ', ' : '') +
                    (address.subLocality ? address.subLocality + ', ' : '') +
                    (address.administrativeArea ? address.administrativeArea + ', ' : '') +
                    (address.postalCode ? address.postalCode + ', ' : '') +
                    (address.countryName ? address.countryName : '');

                const betweenTwoLocalities: boolean = !address.locality || !address.subLocality;

                this.wasteLocation = { gpsLatitude: coordinates.coords.latitude, gpsLongitude: coordinates.coords.longitude, address: addressResult, details: null, betweenTwoLocalities };
                setTimeout(() => {
                    this.createPreviewMap();
                }, 750);
            }
        });
    }

    async createPreviewMap() {
        if (this.previewMap) {
            this.previewMap.setCamera({ coordinate: { lat: this.wasteLocation.gpsLatitude, lng: this.wasteLocation.gpsLongitude } });
            if (this.oldMarker !== null) this.previewMap.removeMarker(this.oldMarker);
        } else {
            const boundingRect = this.mapRef.nativeElement.getBoundingClientRect() as DOMRect;
            this.previewMap = await GoogleMap.create({
                id: 'waste-map',
                apiKey: environment.mapKey,
                element: this.mapRef.nativeElement,
                config: {
                    width: Math.round(boundingRect.width),
                    height: Math.round(boundingRect.height),
                    x: Math.round(boundingRect.x),
                    y: Math.round(boundingRect.y),
                    center: { lat: this.wasteLocation.gpsLatitude, lng: this.wasteLocation.gpsLongitude },
                    zoom: 16,
                    styles: this.centreService.getMapStyle(),
                    disableDefaultUI: true,
                    disableDoubleClickZoom: true
                },
                forceCreate: true
            });
            await this.previewMap.enableCurrentLocation(false);
        }
        this.createPreviewMarker();
    }

    setWasteFit(size: string) {
        const findWasteFit = this.wasteFits.find(x => x.size === size);
        if(!findWasteFit) return;

        if(findWasteFit.selected) return;

        this.wasteFits.forEach(x => x.selected = false);
        findWasteFit.selected = true;
    }

    async createPreviewMarker() {
        if (this.previewMap === null) return;

        const previewMarker: Marker = { coordinate: { lat: this.wasteLocation.gpsLatitude, lng: this.wasteLocation.gpsLongitude } };
        this.oldMarker = await this.previewMap.addMarker(previewMarker);
    }

    async sendDump() {
        if(this.sizeNotSelected()) {
            this.toastService.showToast(this.translateService.instant('Tabs.WasteHunter.Add.Fit.NotSelected'), 'alert-circle-outline', 3000, 'top', 'danger');
            return;
        }
        const response = await fetch(this.wastePhoto.webPath);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', blob, 'waste.jpg');
        formData.append('userId', this.currentUser !== null ? this.currentUser.id.toString() : '-1');
        formData.append('details', this.wasteLocation.details === null ? '' : this.wasteLocation.details);
        formData.append('address', this.wasteLocation.address);
        formData.append('gpsLatitude', this.wasteLocation.gpsLatitude.toString());
        formData.append('gpsLongitude', this.wasteLocation.gpsLongitude.toString());
        formData.append('size', this.wasteFits.find(x=> x.selected).size);
        formData.append('betweenTwoLocalities', this.wasteLocation.betweenTwoLocalities.toString());
        this.uploadDump(formData);
    }

    sizeNotSelected() {
        return this.wasteFits.find(x => x.selected) === undefined;
    }

    async uploadDump(formData: FormData) {
        await this.loaderService.showLoader();
        this.wasteHunterService.addWasteHunterEntry(formData).pipe(
            finalize(() => {
                this.loaderService.hideLoader();
            })
        ).subscribe(async (res) => {
            await this.toastService.showToast(this.translateService.instant('Tabs.WasteHunter.Add.Success'), 'checkmark-circle-outline', 2000, 'top', 'success');
            this.resetRecording();
            this.wasteHunterEntries = null;
            setTimeout(() => {
                this.getLastEntries();
            }, 500);
        });
    }

    getLocationName(entry: IWasteHunter) {
        if (entry.location === '' || entry.location === null || entry.location === undefined) return `${entry.gpsLatitude.toFixed(5)}, ${entry.gpsLongitude.toFixed(5)}`;
        return entry.location;
    }

    viewInformation(item: IWasteHunter) {
        this.openModal(WastehunterDetailsPage, item);
    }

    async openModal(componentRef, data = null) {
        if (componentRef === null) return;
        await this.modalService.openModal(componentRef, data);
    }
}

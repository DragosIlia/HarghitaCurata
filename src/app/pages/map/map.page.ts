import { Component, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { ICollectionCentre, ICollectionCentreFraction } from 'src/app/interfaces/ICollectionCentre';
import { environment } from 'src/environments/environment';
import { CentreService } from '../../services/centre/centre.service';
import { CentreDetailsPage } from '../centre-details/centre-details.page';
import { MarkerClickCallbackData } from '@capacitor/google-maps/dist/typings/definitions';
import { LocationService } from '../../services/location/location.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { MapFilterPage } from '../map-filter/map-filter.page';
import { ModalService } from '../../services/modal/modal.service';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language/language.service';
import { openNavigation } from '../../helpers/open-navigation';
import { Capacitor } from '@capacitor/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-map',
    templateUrl: 'map.page.html',
    styleUrls: ['map.page.scss']
})
export class MapPage {
    @ViewChild('map') mapRef: ElementRef;
    public map: GoogleMap = null;
    public centreModal: HTMLIonModalElement = null;
    public centres: ICollectionCentre[] = [];
    public savedCentres: ICollectionCentre[] = [];
    public centresMarkers: string[] = [];
    public fractionTypes: ICollectionCentreFraction[] = null;
    public savedFractionTypes: ICollectionCentreFraction[] = null;
    public fractionsSubscribe: Subscription = null;
    public trackingCentres: any = null;
    public nearestCentres: ICollectionCentre[] | null = null;
    public currentLanguage: string = null;
    public languageSubscribe: Subscription = null;
    public nearestCentresEnable: boolean = true;
    public isIOS: boolean = Capacitor.getPlatform() === 'ios';
    private isMapPageActive = false;
    private isMapInitializing = false;
    private mapAttemptId = 0;
    private cancelMapSizeWait: (() => void) | null = null;

    constructor(
        private languageService: LanguageService,
        private centreService: CentreService, 
        private modalService: ModalService, 
        private locationService: LocationService, 
        private toastService: ToastService, 
        private translateService: TranslateService
    ) { }

    ionViewDidEnter() {
        this.isMapPageActive = true;
        const attemptId = ++this.mapAttemptId;
        if (this.map || this.isMapInitializing) return;
        this.getMainLanguage();
        this.isMapInitializing = true;
        void this.createMap().finally(() => {
            this.isMapInitializing = false;
            if (this.isMapPageActive && !this.map && this.mapAttemptId !== attemptId) {
                this.ionViewDidEnter();
            }
        });
    }

    ionViewDidLeave() {
        this.isMapPageActive = false;
        this.mapAttemptId++;
        this.cancelMapSizeWait?.();
        this.resetMap();
    }

    private waitForMapBounds(): Promise<DOMRect | null> {
        return new Promise(resolve => {
            const element = this.mapRef?.nativeElement as HTMLElement | undefined;
            if (!element) {
                resolve(null);
                return;
            }

            let finished = false;
            const observer = new ResizeObserver(() => checkSize());
            const finish = (bounds: DOMRect | null) => {
                if (finished) return;
                finished = true;
                observer.disconnect();
                this.cancelMapSizeWait = null;
                resolve(bounds);
            };
            const checkSize = () => {
                if (!this.isMapPageActive) {
                    finish(null);
                    return;
                }
                const bounds = element.getBoundingClientRect();
                if (bounds.width > 0 && bounds.height > 0) finish(bounds);
            };

            this.cancelMapSizeWait = () => finish(null);
            observer.observe(element);
            requestAnimationFrame(checkSize);
        });
    }

    getMainLanguage() {
        this.languageSubscribe = this.languageService.getLanguage().subscribe(language => {
            this.currentLanguage = language;
        });
    }

    resetMap() {
        if (this.map) {
            this.map.removeMarkers(this.centresMarkers);
            this.map.destroy();
            this.map = null;
        }
        if (this.centreModal) {
            this.centreModal.dismiss();
            this.centreModal = null;
        }
        if (this.fractionsSubscribe) {
            this.fractionsSubscribe.unsubscribe();
            this.fractionsSubscribe = null;
        }
        if (this.languageSubscribe) {
            this.languageSubscribe.unsubscribe();
            this.languageSubscribe = null;
        }
        if (this.trackingCentres) {
            clearInterval(this.trackingCentres);
            this.trackingCentres = null;
        }
        this.nearestCentres = null;
        this.centres = [];
        this.savedCentres = [];
        this.centreService.setFractions(null);
    }

    enableFiltering(event: Event) {
        event.stopPropagation;
        this.openModal(MapFilterPage, this.fractionTypes);
    }

    async openModal(componentRef, data = null) {
        if (componentRef === null) return;
        await this.modalService.openModal(componentRef, data);
    }

    async createMap() {
        const locationEnabled = await this.locationService.getLocationEnabled();
        if (!locationEnabled) {
            this.locationService.noLocation();
            return;
        }
        const locationAuthorized = await this.locationService.getLocationAuthorized();
        if (!locationAuthorized) {
            this.toastService.showToast(this.translateService.instant('Location.PreciseNeeded'), 'alert-circle-outline', 3000, 'top', 'danger');
            return;
        }

        const currentLocation = await this.locationService.getCurrentLocation();
        if (!this.isMapPageActive) return;
        const boundingRect = await this.waitForMapBounds();
        if (!boundingRect || !this.isMapPageActive) return;
        const mapConfig: any = {
        width: Math.round(boundingRect.width),
        height: Math.round(boundingRect.height),
        x: Math.round(boundingRect.x),
        y: Math.round(boundingRect.y),
        center: { lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude },
        zoom: 17,
        disableDefaultUI: true,
        zoomControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        myLocationButton: false,

        minZoom: 4,
        maxZoom: 20
        };
        if (Capacitor.getPlatform() !== 'web') {
            mapConfig.styles = this.centreService.getMapStyle();
        }
        console.log('Creating map...');
        const map = await GoogleMap.create({
            id: 'centres-map',
            apiKey: environment.mapKey,
            element: this.mapRef.nativeElement,
            config: mapConfig,
            forceCreate: true
        });
        if (!this.isMapPageActive) {
            await map.destroy();
            return;
        }
        this.map = map;
        await this.setMapTopPadding();
        await this.map.enableCurrentLocation(true);
        await this.moveMapToCurrentLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
        await this.getFractions();
        await this.getCentres();
        this.listenFractions();
    }

    async goToCurrentLocation(event: Event) {
        event.stopPropagation;
        if (!this.map) return;

        try {
            const currentLocation = await this.locationService.getCurrentLocation();
            await this.moveMapToCurrentLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
        } catch {
            this.toastService.showToast(
            this.translateService.instant('Location.PreciseNeeded'),
            'alert-circle-outline',
            2000,
            'top',
            'danger'
            );
        }
    }

    async setMapTopPadding() {
        if (!this.map) return;

        const rootStyles = getComputedStyle(document.documentElement);
        const safeAreaTop = parseFloat(rootStyles.getPropertyValue('--ion-safe-area-top') || '0');
        if (!Number.isFinite(safeAreaTop) || safeAreaTop <= 0) return;

        await this.map.setPadding({
            top: Math.ceil(safeAreaTop + 30),
            left: 0,
            right: 0,
            bottom: 0
        });
    }

    moveMapToCurrentLocation(lat: number, lng: number) {
        if (!this.map) return;
        this.map.setCamera({
            coordinate: { lat, lng },
            animate: true,
            zoom: 17,
            animationDuration: 4000
        });
    }

    getFractions() {
        if (!this.map) return;
        this.centreService.getFractionTypes().subscribe((data: ICollectionCentreFraction[]) => {
            const fractions = data.filter(x => !x.special);
            fractions.forEach(x => x.selected = false);
            this.centreService.setFractions(fractions);
            this.savedFractionTypes = fractions;
            this.fractionTypes = fractions;
        });
    }

    getCentres() {
        if (!this.map) return;
        this.centreService.getCentres().subscribe(centres => {
            this.centres = centres;
            this.savedCentres = this.centres;
            this.centreService.setCentres(this.centres);
            this.createMarkers();
            this.enableTrackingCentres();
        });
    }

    enableTrackingCentres() {
        this.getNearestTwoCentres();
        this.trackingCentres = setInterval(() => { this.getNearestTwoCentres(); }, 5000);
    }

    toggleCentres() {
        this.nearestCentresEnable = !this.nearestCentresEnable;
    }

    async getNearestTwoCentres() {
        if (!this.map) return;

        if (!this.centres || this.centres.length <= 0) {
            this.nearestCentres = null;
            return;
        }

        try {
            const currentLocation = await this.locationService.getCurrentLocation();
            this.nearestCentres = this.centres.map(x => ({
                ...x,
                distance: this.getDistanceFromLatLonInKm(currentLocation.coords.latitude, currentLocation.coords.longitude, x.gpsLatitude, x.gpsLongitude),
            }))
            .sort((a, b) => a.distance < b.distance ? -1 : 1)
            .slice(0, 2);
        } catch(e) {
            this.nearestCentres = [];
            console.log('Getting neearest centres error', e);
        }
    }

    moveCameraToCentre(centre: ICollectionCentre)
    {
        if (!this.map) return;

        const lat = centre.gpsLatitude;
        const lng = centre.gpsLongitude;

        this.map.setCamera({
            coordinate: { lat, lng },
            animate: true,
            zoom: 17,
            animationDuration: 2000
        });
    }

    navigateToCentre(centre: ICollectionCentre)
    {
        const latitude = centre.gpsLatitude;
        const longitude = centre.gpsLongitude;
        let name = centre.name;

        switch(this.currentLanguage) {
            case 'gb':
                name = centre.nameGb;
                break;
            case 'hu':
                name = centre.nameHu;
                break;
            default: break;
        }

        console.log(`Navigate to ${name} (lat:${latitude}, lng: ${longitude})`);
        void openNavigation(latitude, longitude);
    }

    getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d * 1000;
    }


    deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

    async createMarkers() {
        if (!this.map || !this.centres) return;

        const markers: Marker[] = [];
        this.centres.forEach(x => {
            markers.push({
                coordinate: { lat: x.gpsLatitude, lng: x.gpsLongitude },
            });
        });
        this.centresMarkers = await this.map.addMarkers(markers);
        this.map.setOnMarkerClickListener((event) => {
            this.viewCentre(event);
        });
    }

    listenFractions() {
        this.fractionsSubscribe = this.centreService.getFractions().subscribe(fractions => {
            this.filterCentres(fractions);
        });
    }

    filterCentres(fractionTypes: ICollectionCentreFraction[]) {
        if (!this.map || !this.savedFractionTypes || !fractionTypes) return;

        this.fractionTypes = fractionTypes;
        const selectedFractions = this.fractionTypes.filter(x => x.selected).map(x => x.id);
        if (selectedFractions != null && selectedFractions.length === 0) {
            this.resetMarkers(this.savedCentres);
            return;
        }

        const newCentres: ICollectionCentre[] = [];
        this.savedCentres.forEach(centre => {
            if (centre.fractions !== null) {
                const fractionsArray = centre.fractions.split(',').map(Number);
                if (selectedFractions.every(r => fractionsArray.includes(r))) {
                    newCentres.push(centre);
                }
            }
        });
        this.resetMarkers(newCentres);
    }

    resetMarkers(centres) {
        if (this.centresMarkers)
            this.map.removeMarkers(this.centresMarkers);

        this.centres = centres;
        this.getNearestTwoCentres();
        this.createMarkers();
    }


    viewCentre(centre: MarkerClickCallbackData) {
        this.openModal(CentreDetailsPage, centre);
    }

}



// /* eslint-disable @typescript-eslint/no-inferrable-types */
// /* eslint-disable max-len */
// /* eslint-disable curly */
// import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
// import { GoogleMap, Marker } from '@capacitor/google-maps';
// import { ICollectionCentre, ICollectionCentreFraction } from 'src/app/interfaces/ICollectionCentre';
// import { environment } from 'src/environments/environment';
// import { CentreService } from '../../services/centre/centre.service';
// import { CentreDetailsPage } from '../centre-details/centre-details.page';
// import { MarkerClickCallbackData } from '@capacitor/google-maps/dist/typings/definitions';
// import { LocationService } from '../../services/location/location.service';
// import { ToastService } from '../../services/toast/toast.service';
// import { TranslateService } from '@ngx-translate/core';
// import { MapFilterPage } from '../map-filter/map-filter.page';
// import { ModalService } from '../../services/modal/modal.service';
// import { Subscription } from 'rxjs';
// import { LanguageService } from '../../services/language/language.service';
// import { openNavigation } from '../../helpers/open-navigation';
// import { ModalController } from '@ionic/angular/lazy';
// import { PlatformDetailsPage } from 'src/app/platform-details/platform-details.page';
// @Component({
//     selector: 'app-map',
//     templateUrl: 'map.page.html',
//     styleUrls: ['map.page.scss']
// })
// export class MapPage {
//     @ViewChild('map') mapRef: ElementRef;
//     public map: GoogleMap = null;
//     public centreModal: HTMLIonModalElement = null;
//     public centres: ICollectionCentre[] = [];
//     public savedCentres: ICollectionCentre[] = [];
//     public centresMarkers: string[] = [];
//     public fractionTypes: ICollectionCentreFraction[] = null;
//     public savedFractionTypes: ICollectionCentreFraction[] = null;
//     public fractionsSubscribe: Subscription = null;
//     public trackingCentres: any = null;
//     public nearestCentres: ICollectionCentre[] | null = null;
//     public currentLanguage: string = null;
//     public languageSubscribe: Subscription = null;
//     public nearestCentresEnable: boolean = true;

//     public dummyMarker: any[] = [
//         {
//         "id": 4164,
//         "name": "Mehedinti_31",
//         "code": "Oradea_1",
//         "gpsLatitude": 47.105079,
//         "gpsLongitude": 21.830442,
//         "battery": 12.052,
//         "humidity": 0,
//         "temperature": 12,
//         "platformsModule": [
//             {
//                 "id": 16295,
//                 "platformOrder": 0,
//                 "platform": "{\"id\":4164,\"name\":\"Mehedinti_31\",\"code\":\"Oradea_1\",\"gpsLatitude\":4704.9274399999995,\"gpsLongitude\":2155.084374,\"battery\":12.052,\"humidity\":0.0,\"temperature\":12.0,\"PlatformsModule\":null}",
//                 "fractionType": "{\"id\":5,\"name\":\"Plastic-Metal\",\"wasteCode\":\"15 01 02\"}",
//                 "simCode": "226102500555164",
//                 "code": "004500704b3250162034394e",
//                 "state": 0,
//                 "door": 0,
//                 "battery": 12.118,
//                 "humidity": 0,
//                 "temperature": 11,
//                 "volumeEmpty": 0,
//                 "volumeFull": 0,
//                 "volume": 50,
//                 "collectionDate": "2025-06-30A12:15:57",
//                 "capacity": 0,
//                 "volumMM": 126,
//                 "calculationMethod": 0
//             },
//             {
//                 "id": 16311,
//                 "platformOrder": 0,
//                 "platform": "{\"id\":4164,\"name\":\"Mehedinti_31\",\"code\":\"Oradea_1\",\"gpsLatitude\":4704.9274399999995,\"gpsLongitude\":2155.084374,\"battery\":12.052,\"humidity\":0.0,\"temperature\":12.0,\"PlatformsModule\":null}",
//                 "fractionType": "{\"id\":1,\"name\":\"Rezidual\",\"wasteCode\":\"01 05 05\"}",
//                 "simCode": "226101301074201",
//                 "code": "004400734b3250162034394e",
//                 "state": 0,
//                 "door": 0,
//                 "battery": 12.085,
//                 "humidity": 0,
//                 "temperature": 13,
//                 "volumeEmpty": 0,
//                 "volumeFull": 0,
//                 "volume": 81,
//                 "collectionDate": "2025-06-30A12:02:08",
//                 "capacity": 0,
//                 "volumMM": 124,
//                 "calculationMethod": 0
//             },
//             {
//                 "id": 16304,
//                 "platformOrder": 0,
//                 "platform": "{\"id\":4164,\"name\":\"Mehedinti_31\",\"code\":\"Oradea_1\",\"gpsLatitude\":4704.9274399999995,\"gpsLongitude\":2155.084374,\"battery\":12.052,\"humidity\":0.0,\"temperature\":12.0,\"PlatformsModule\":null}",
//                 "fractionType": "{\"id\":6,\"name\":\"Sticla\",\"wasteCode\":\"15 01 07\"}",
//                 "simCode": "226101301074141",
//                 "code": "0049003d4b3250192034394e",
//                 "state": 0,
//                 "door": 0,
//                 "battery": 12.052,
//                 "humidity": 0,
//                 "temperature": 12,
//                 "volumeEmpty": 0,
//                 "volumeFull": 0,
//                 "volume": 12,
//                 "collectionDate": "2025-06-30A12:51:26",
//                 "capacity": 0,
//                 "volumMM": 161,
//                 "calculationMethod": 0
//             },
//             {
//                 "id": 16308,
//                 "platformOrder": 0,
//                 "platform": "{\"id\":4164,\"name\":\"Mehedinti_31\",\"code\":\"Oradea_1\",\"gpsLatitude\":4704.9274399999995,\"gpsLongitude\":2155.084374,\"battery\":12.052,\"humidity\":0.0,\"temperature\":12.0,\"PlatformsModule\":null}",
//                 "fractionType": "{\"id\":4,\"name\":\"Hartie\",\"wasteCode\":\"15 01 01\"}",
//                 "simCode": "226101301074205",
//                 "code": "002800664b3250162034394e",
//                 "state": 0,
//                 "door": 0,
//                 "battery": 12.019,
//                 "humidity": 0,
//                 "temperature": 13,
//                 "volumeEmpty": 0,
//                 "volumeFull": 0,
//                 "volume": 0,
//                 "collectionDate": "2025-06-30A12:00:39",
//                 "capacity": 0,
//                 "volumMM": 139,
//                 "calculationMethod": 0
//             },
//             {
//                 "id": 16217,
//                 "platformOrder": 0,
//                 "platform": "{\"id\":4164,\"name\":\"Mehedinti_31\",\"code\":\"Oradea_1\",\"gpsLatitude\":4704.9274399999995,\"gpsLongitude\":2155.084374,\"battery\":12.052,\"humidity\":0.0,\"temperature\":12.0,\"PlatformsModule\":null}",
//                 "fractionType": "{\"id\":9,\"name\":\"Biodegradabil\",\"wasteCode\":\"\"}",
//                 "simCode": "226101301074349",
//                 "code": "003900374b3250132034394e",
//                 "state": 0,
//                 "door": 0,
//                 "battery": 12.118,
//                 "humidity": 0,
//                 "temperature": 15,
//                 "volumeEmpty": 0,
//                 "volumeFull": 0,
//                 "volume": 0,
//                 "collectionDate": "2025-06-30A12:03:29",
//                 "capacity": 0,
//                 "volumMM": 150,
//                 "calculationMethod": 0
//             }
//         ]
//     }];

//     constructor(
//         private languageService: LanguageService,
//         private centreService: CentreService,
//         private modalService: ModalService,
//         private locationService: LocationService,
//         private toastService: ToastService,
//         private translateService: TranslateService,
//         private modalCtrl: ModalController
//     ) { }

//     async ionViewWillEnter() {
//         this.getMainLanguage();
//         await this.createMap();
//     }

//     ionViewDidLeave() {
//         this.resetMap();
//     }

//     getMainLanguage() {
//         this.languageSubscribe = this.languageService.getLanguage().subscribe(language => {
//             this.currentLanguage = language;
//         });
//     }

//     resetMap() {
//         if (this.map) {
//             this.map.removeMarkers(this.centresMarkers);
//             this.map.destroy();
//             this.map = null;
//         }
//         if (this.centreModal) {
//             this.centreModal.dismiss();
//             this.centreModal = null;
//         }
//         if (this.fractionsSubscribe) {
//             this.fractionsSubscribe.unsubscribe();
//             this.fractionsSubscribe = null;
//         }
//         if (this.languageSubscribe) {
//             this.languageSubscribe.unsubscribe();
//             this.languageSubscribe = null;
//         }
//         if (this.trackingCentres) {
//             clearInterval(this.trackingCentres);
//             this.trackingCentres = null;
//         }
//         this.nearestCentres = null;
//         this.centres = [];
//         this.savedCentres = [];
//         this.centreService.setFractions(null);
//     }

//     enableFiltering() {
//         this.openModal(MapFilterPage, this.fractionTypes);
//     }

//     async openModal(componentRef, data = null) {
//         if (componentRef === null) return;
//         await this.modalService.openModal(componentRef, data);
//     }

//     async createMap() {
//         const locationEnabled = await this.locationService.getLocationEnabled();
//         if (!locationEnabled) {
//             this.locationService.noLocation();
//             return;
//         }

//         const locationAuthorized = await this.locationService.getLocationAuthorized();
//         if (!locationAuthorized) {
//             this.toastService.showToast(this.translateService.instant('Location.PreciseNeeded'), 'alert-circle-outline', 3000, 'top', 'danger');
//             return;
//         }

//         let currentLocation;
//         try {
//             currentLocation = await this.locationService.getCurrentLocation();
//         } catch (error) {
//             console.warn('Falling back to default location because getCurrentLocation failed:', error);
//             currentLocation = {
//                 coords: {
//                     latitude: 47.073, // Oradea fallback
//                     longitude: 21.530
//                 }
//             };
//         }

//         const boundingRect = this.mapRef.nativeElement.getBoundingClientRect() as DOMRect;
//         console.log('Creating map with coords:', currentLocation.coords);

//         this.map = await GoogleMap.create({
//             id: 'centres-map',
//             apiKey: environment.mapKey,
//             element: this.mapRef.nativeElement,
//             config: {
//                 width: Math.round(boundingRect.width),
//                 height: Math.round(boundingRect.height),
//                 x: Math.round(boundingRect.x),
//                 y: Math.round(boundingRect.y),
//                 center: {
//                     lat: currentLocation.coords.latitude,
//                     lng: currentLocation.coords.longitude
//                 },
//                 zoom: 17,
//                 styles: this.centreService.getMapStyle(),
//                 disableDefaultUI: true,
//                 minZoom: 4,
//                 maxZoom: 20
//             },
//             forceCreate: true
//         });

//         await this.map.enableCurrentLocation(true);
//         this.moveMapToCurrentLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
//         this.getFractions();
//         this.getCentres();
//         this.listenFractions();
//     }

//     moveMapToCurrentLocation(lat: number, lng: number) {
//         if (!this.map) return;
//         this.map.setCamera({
//             coordinate: { lat, lng },
//             animate: true,
//             zoom: 17,
//             animationDuration: 4000
//         });
//     }

//     getFractions() {
//         if (!this.map) return;
//         this.centreService.getFractionTypes().subscribe((data: ICollectionCentreFraction[]) => {
//             const fractions = data.filter(x => !x.special);
//             fractions.forEach(x => x.selected = false);
//             this.centreService.setFractions(fractions);
//             this.savedFractionTypes = fractions;
//             this.fractionTypes = fractions;
//         });
//     }

//     getCentres() {
//         if (!this.map) return;
//         this.centreService.getCentres().subscribe(centres => {
//             this.centres = centres;
//             this.savedCentres = this.centres;
//             this.centreService.setCentres(this.centres);
//             this.createMarkers();
//             this.enableTrackingCentres();
//         });
//     }

//     enableTrackingCentres() {
//         this.getNearestTwoCentres();
//         this.trackingCentres = setInterval(() => { this.getNearestTwoCentres(); }, 5000);
//     }

//     toggleCentres() {
//         this.nearestCentresEnable = !this.nearestCentresEnable;
//     }

//     async getNearestTwoCentres() {
//         if (!this.map) return;

//         if (!this.centres || this.centres.length <= 0) {
//             this.nearestCentres = null;
//             return;
//         }

//         try {
//             const currentLocation = await this.locationService.getCurrentLocation();
//             this.nearestCentres = this.centres.map(x => ({
//                 ...x,
//                 distance: this.getDistanceFromLatLonInKm(currentLocation.coords.latitude, currentLocation.coords.longitude, x.gpsLatitude, x.gpsLongitude),
//             }))
//             .sort((a, b) => a.distance < b.distance ? -1 : 1)
//             .slice(0, 2);
//         } catch(e) {
//             this.nearestCentres = [];
//             console.log('Getting neearest centres error', e);
//         }
//     }

//     moveCameraToCentre(centre: ICollectionCentre)
//     {
//         if (!this.map) return;

//         const lat = centre.gpsLatitude;
//         const lng = centre.gpsLongitude;

//         this.map.setCamera({
//             coordinate: { lat, lng },
//             animate: true,
//             zoom: 17,
//             animationDuration: 2000
//         });
//     }

//     navigateToCentre(centre: ICollectionCentre)
//     {
//         const latitude = centre.gpsLatitude;
//         const longitude = centre.gpsLongitude;
//         let name = centre.name;

//         switch(this.currentLanguage) {
//             case 'gb':
//                 name = centre.nameGb;
//                 break;
//             case 'hu':
//                 name = centre.nameHu;
//                 break;
//             default: break;
//         }

//         console.log(`Navigate to ${name} (lat:${latitude}, lng: ${longitude})`);
//         void openNavigation(latitude, longitude);
//     }

//     getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
//         const R = 6371; // Radius of the earth in km
//         const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
//         const dLon = this.deg2rad(lon2 - lon1);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//             const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const d = R * c; // Distance in km
//         return d * 1000;
//     }


//     deg2rad(deg: number) {
//         return deg * (Math.PI / 180);
//     }

//     async createMarkers() {
//         if (!this.map || !this.centres) return;

//         const markers: Marker[] = [];

//         this.centres.forEach(x => {
//             markers.push({
//                 coordinate: { lat: x.gpsLatitude, lng: x.gpsLongitude },
//                 iconUrl: 'assets/markers/red-marker.png'
//             });
//         });

//         const dummy = this.dummyMarker[0];
//         if (dummy) {
//             markers.push({
//                 coordinate: { lat: dummy.gpsLatitude, lng: dummy.gpsLongitude},
//                 iconUrl: 'assets/markers/green-marker.png'
//             });
//         }

//         this.centresMarkers = await this.map.addMarkers(markers);
//         console.log('Markers added:', this.centresMarkers.length);

//         this.map.setOnMarkerClickListener((event) => {
//             this.viewCentre(event);
//         });
//     }

//     listenFractions() {
//         this.fractionsSubscribe = this.centreService.getFractions().subscribe(fractions => {
//             this.filterCentres(fractions);
//         });
//     }

//     filterCentres(fractionTypes: ICollectionCentreFraction[]) {
//         if (!this.map || !this.savedFractionTypes || !fractionTypes) return;

//         this.fractionTypes = fractionTypes;
//         const selectedFractions = this.fractionTypes.filter(x => x.selected).map(x => x.id);
//         if (selectedFractions != null && selectedFractions.length === 0) {
//             this.resetMarkers(this.savedCentres);
//             return;
//         }

//         const newCentres: ICollectionCentre[] = [];
//         this.savedCentres.forEach(centre => {
//             if (centre.fractions !== null) {
//                 const fractionsArray = centre.fractions.split(',').map(Number);
//                 if (selectedFractions.every(r => fractionsArray.includes(r))) {
//                     newCentres.push(centre);
//                 }
//             }
//         });
//         this.resetMarkers(newCentres);
//     }

//     resetMarkers(centres) {
//         if (this.centresMarkers)
//             this.map.removeMarkers(this.centresMarkers);

//         this.centres = centres;
//         this.getNearestTwoCentres();
//         this.createMarkers();
//     }

//     async viewCentre(centre: MarkerClickCallbackData) {
//         if (!this.map || !centre) return;

//         const isDummy = centre.latitude === this.dummyMarker[0].gpsLatitude &&
//                         centre.longitude === this.dummyMarker[0].gpsLongitude;

//         if (isDummy) {
//                 const modal = await this.modalCtrl.create({
//         component: PlatformDetailsPage,
//         componentProps: {
//             data: this.dummyMarker[0]
//         },
//         // breakpoints: [0, 0.9],
//         initialBreakpoint: 1,
//         presentingElement: await this.modalCtrl.getTop()
//     });

//     await modal.present();
//         } else {
//             this.openModal(CentreDetailsPage, centre);
//         }

//         setTimeout(() => {
//             this.map.setCamera({
//                 coordinate: {
//                     lat: centre.latitude,
//                     lng: centre.longitude
//                 },
//                 animate: true,
//                 zoom: 12,
//                 animationDuration: 100
//             });
//         }, 300);
//     }


// }

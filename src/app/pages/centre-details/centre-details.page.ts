/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable id-blacklist */
/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { Marker } from '@capacitor/google-maps';
import { MarkerClickCallbackData } from '@capacitor/google-maps/dist/typings/definitions';
import { CentreService } from '../../services/centre/centre.service';
import { ICollectionCentre, ICollectionCentreFraction, ICollectionCentreItem } from '../../interfaces/ICollectionCentre';
import { openNavigation } from '../../helpers/open-navigation';
import { LanguageService } from '../../services/language/language.service';
import { RecyclablesPage } from '../recyclables/recyclables.page';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-centre-details',
    templateUrl: './centre-details.page.html',
    styleUrls: ['./centre-details.page.scss'],
})
export class CentreDetailsPage implements OnInit {
    public data: MarkerClickCallbackData;
    public currentCentre: ICollectionCentre = null;
    public currentCentreFractions: ICollectionCentreFraction[] = [];
    public locale: string = 'en';

    public loadingCentreItems: boolean = true;
    public centreItems: ICollectionCentreItem[] | null = null;
    public featuredCentreItems: ICollectionCentreItem[] | null = null;

    constructor(private centreService: CentreService, private languageService: LanguageService, private modalService: ModalService) { }

    ngOnInit() {
        this.getLocaleData();
    }

    getLastCentreItems(centreId: number) {
        setTimeout(() => {
            this.centreService.getCentreItemsById(centreId).subscribe({
                next: (res) => {
                    this.centreItems = res;
                    if(this.centreItems.length > 0) this.featuredCentreItems = this.centreItems.slice(0, 3);
                    else this.featuredCentreItems = [];
                    this.loadingCentreItems = false;
                },
                error: (err: any) => {
                    this.centreItems = [];
                    this.featuredCentreItems = [];
                    this.loadingCentreItems = false;
                    console.log(err);
                }
            });
        }, 1200);

    }

    getLocaleData() {
        this.languageService.getLocale().subscribe(res => {
            this.locale = res;
            this.getFullInformationOfCentre();
        });
    }

    getFullInformationOfCentre() {
        const collectionCentres = this.centreService.receiveCentres();
        if (!collectionCentres || collectionCentres.length <= 0) return;
        const findCentre = collectionCentres.find(x => x.gpsLatitude === this.data.latitude && x.gpsLongitude === this.data.longitude);
        if (!findCentre) return;
        this.setCentre(findCentre);
    }

    setCentre(centre: ICollectionCentre) {
        this.currentCentre = centre;
        this.getLastCentreItems(centre.id);
        this.getCentreFractions(centre);
    }

    getCentreFractions(centre: ICollectionCentre) {
        this.centreService.getFractions().subscribe({
            next: (res) => {
                if (!res) return;

                if (centre.fractions !== null) {
                    const fractionsArray = centre.fractions.split(',').map(Number);
                    this.currentCentreFractions = res.filter(x => fractionsArray.includes(x.id));
                }
            },
            error: (err: any) => {
                console.log(err);
                this.currentCentreFractions = [];
            }
        });
    }

    hexToRGB(fractionId) {
        const findFraction = this.currentCentreFractions.find((fraction: ICollectionCentreFraction) => fraction.id === fractionId);
        if (!findFraction) return '#000';

        const r = parseInt(findFraction.color.slice(1, 3), 16);
        const g = parseInt(findFraction.color.slice(3, 5), 16);
        const b = parseInt(findFraction.color.slice(5, 7), 16);

        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + 1 + ')';
    }

    navigateTo(centre: ICollectionCentre) {

        const latitude = centre.gpsLatitude;
        const longitude = centre.gpsLongitude;
        let name = centre.name;

        switch (this.locale) {
            case 'en':
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

    call(phoneNumber: string) {
        console.log(`Calling ${phoneNumber}`);
        window.open(`tel:${phoneNumber}`);
    }

    visitLink(link: string) {
        window.open(link);
    }

    async openModal(componentRef, data = null) {
        if (componentRef === null) return;
        await this.modalService.openModal(componentRef, data);
    }

    seeAllItems() {
        if(!this.centreItems) return;

        if(this.centreItems && this.centreItems.length <= 3) return;

        this.openModal(RecyclablesPage, this.centreItems);
    }

}

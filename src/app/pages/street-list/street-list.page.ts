/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/lazy';
import { IPaginated } from 'src/app/interfaces/IPaginated';
import { IStreet } from '../../interfaces/IStreet';
import { ISelectedCity } from '../add-address/add-address.page';
import { StreetService } from '../../services/street/street.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-street-list',
    templateUrl: './street-list.page.html',
    styleUrls: ['./street-list.page.scss'],
})
export class StreetListPage implements OnInit {
    public streets: IStreet[] = [];
    public pageNumber = 1;
    public pageSize = 20;
    public pagination: IPaginated | undefined;

    public data: ISelectedCity;

    public searchString: string = null;

    constructor(private streetService: StreetService, private modalCtrl: ModalController) { }

    ngOnInit() {
        this.getAllStreets();
    }

    getAllStreets(onInit: boolean = true) {
        this.streetService.getStreetsByCity(this.data.cityId, this.pageNumber, this.pageSize, this.searchString).subscribe({
            next: response => {
                if (response.result && response.pagination) {
                    this.pagination = response.pagination;
                    if(onInit) this.streets = this.streets.concat(response.result);
                    else this.streets = response.result;
                }
            },
            error: error => {
                console.log('Error from street-list.component: ', error);
            }
        });

    }

    selectStreet(street: IStreet) {
        this.modalCtrl.dismiss(street, 'success');
    }

    filter(event: any) {
        const filter = event.detail.value.toLowerCase();
        const filterWithoutDiacritics = filter.normalize('NFKD').replace(/[^\w]/g, '');
        this.pageNumber = 1;
        this.streets = [];
        this.searchString = filterWithoutDiacritics;
        this.getAllStreets(false);
    }

    onIonInfinite(event) {
        this.pageNumber++;
        this.getAllStreets();
        setTimeout(() => {
            event.target.complete();
            // if(this.streets.length >= this.pagination.totalItems)
            //     event.target.disabled = true;
        }, 500);
    }


}

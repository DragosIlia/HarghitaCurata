/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { CitiesService } from '../../services/cities/cities.service';
import { ICity } from '../../interfaces/ICity';
import { InfiniteScrollCustomEvent, IonInfiniteScroll, ModalController } from '@ionic/angular/lazy';
import { IPaginated } from 'src/app/interfaces/IPaginated';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-city-list',
    templateUrl: './city-list.page.html',
    styleUrls: ['./city-list.page.scss'],
})
export class CityListPage implements OnInit {
    public cities: ICity[] = [];
    public pageNumber = 1;
    public pageSize = 20;
    public pagination: IPaginated | undefined;

    public data: number;

    public searchString: string = null;

    constructor(private citiesService: CitiesService, private modalCtrl: ModalController) { }

    ngOnInit() {
        this.getAllCities();
    }

    getAllCities(onInit: boolean = true) {
        this.citiesService.getCities(this.pageNumber, this.pageSize, this.searchString).subscribe({
            next: response => {
                if (response.result && response.pagination) {
                    this.pagination = response.pagination;
                    if(onInit) this.cities = this.cities.concat(response.result);
                    else this.cities = response.result;
                    this.modifyDuplicateCities();
                }
            },
            error: error => {
                console.log('Error from city-list.component: ', error);
            }
        });

    }

    modifyDuplicateCities() {
        if (!this.cities) return;

        const frequency = {};
        const duplicates: ICity[] = [];

        for (const obj of this.cities) {
            const name = obj.name;
            if (frequency[name]) {
                frequency[name]++;
            } else {
                frequency[name] = 1;
            }
        }

        for (const obj of this.cities) {
            const name = obj.name;
            if (frequency[name] > 1) {
                duplicates.push(obj);
            }
        }

        this.cities.forEach(city => {
            const findCity = duplicates.find(x=> x.id === city.id);

            if(findCity) {
                city.fullName = `${city.name} (${city.uat.name})`;
                city.subCity = true;
            }
            else {
                city.fullName = city.name;
                city.subCity = false;
            }
        });
    }

    selectCity(city: ICity) {
        this.modalCtrl.dismiss(city, 'success');
    }

    filter(event: any) {
        const filter = event.detail.value.toLowerCase();
        const filterWithoutDiacritics = filter.normalize('NFKD').replace(/[^\w]/g, '');
        this.pageNumber = 1;
        this.cities = [];
        this.searchString = filterWithoutDiacritics;
        this.getAllCities(false);
    }

    onIonInfinite(event) {
        this.pageNumber++;
        this.getAllCities();
        setTimeout(() => {
            event.target.complete();
            // if(this.cities.length >= this.pagination.totalItems)
            //     event.target.disabled = true;
        }, 500);
    }

}

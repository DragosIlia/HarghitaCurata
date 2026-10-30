/* eslint-disable max-len */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/lazy';
import { IPaginated } from 'src/app/interfaces/IPaginated';
import { CalendarService } from '../../services/calendar/calendar.service';
import { LanguageService } from '../../services/language/language.service';
import { IZone } from '../../interfaces/IZone';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-zone-list',
    templateUrl: './zone-list.page.html',
    styleUrls: ['./zone-list.page.scss'],
})
export class ZoneListPage implements OnInit {
    public zones: IZone[] = [];
    public pageNumber = 1;
    public pageSize = 15;
    public pagination: IPaginated | undefined;

    public data: number;
    public locale: string = 'en';
    public searchString: string = null;

    constructor(private calendarService: CalendarService, private modalCtrl: ModalController, private languageService: LanguageService, private toastService: ToastService, private translateService: TranslateService) { }

    ngOnInit() {
        this.getLocaleData();
        this.getAllZones();
    }

    getLocaleData() {
        this.languageService.getLocale().subscribe(res => {
            this.locale = res;
        });
    }

    getAllZones(onInit: boolean = true) {
        this.calendarService.getCalendarZones(this.pageNumber, this.pageSize, this.searchString).subscribe({
            next: response => {
                if (response.result && response.pagination) {
                    this.pagination = response.pagination;
                    if (onInit) this.zones = this.zones.concat(response.result);
                    else this.zones = response.result;
                }
            },
            error: error => {
                console.log('Error from zone-list.component: ', error);
            }
        });

    }

    selectZone(zone: IZone) {
        if(!zone.calendar || (zone.calendar && zone.calendar.state !== 3)) {
            this.toastService.showToast(this.translateService.instant('Tabs.Dashboard.NoFractions'), 'warning-outline', 2500, 'top', 'warning');
            return;
        }

        this.modalCtrl.dismiss(zone, 'success');
    }

    filter(event: any) {
        const filter = event.detail.value.toLowerCase();
        const filterWithoutDiacritics = filter.normalize('NFKD').replace(/[^\w]/g, '');
        this.pageNumber = 1;
        this.zones = [];
        this.searchString = filterWithoutDiacritics;
        this.getAllZones(false);
    }

    onIonInfinite(event) {
        this.pageNumber++;
        this.getAllZones();
        setTimeout(() => {
            event.target.complete();
            // if(this.cities.length >= this.pagination.totalItems)
            //     event.target.disabled = true;
        }, 500);
    }

    getZoneClass(zone: IZone) {
        if(!zone.calendar || (zone.calendar && zone.calendar.state !== 3)) return 'inactive';

        if(zone.id === this.data) return 'active';
    }

}

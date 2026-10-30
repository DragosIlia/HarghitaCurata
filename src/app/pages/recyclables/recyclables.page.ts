/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ICollectionCentreItem } from 'src/app/interfaces/ICollectionCentre';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-recyclables',
    templateUrl: './recyclables.page.html',
    styleUrls: ['./recyclables.page.scss'],
})
export class RecyclablesPage implements OnInit {
    public data: ICollectionCentreItem[];
    public locale: string = 'en';

    constructor(private languageService: LanguageService) { }

    ngOnInit() {
        this.getLocaleData();
    }

    getLocaleData() {
        this.languageService.getLocale().subscribe(res => {
            this.locale = res;
        });
    }

    handleRefresh(event) {
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    };

}

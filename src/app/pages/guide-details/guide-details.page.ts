/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { IGuide, IGuideDetails } from '../../interfaces/IGuide';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-guide-details',
    templateUrl: './guide-details.page.html',
    styleUrls: ['./guide-details.page.scss'],
})
export class GuideDetailsPage implements OnInit {
    public data: IGuideDetails;
    public locale: string = 'en';

    constructor() { }

    ngOnInit() {
        this.getLocaleData();
    }

    getLocaleData() {
        this.locale = (this.data.language === 'gb') ? 'en' : this.data.language;
    }

    visitLink(link: string) {
        window.open(link);
    }
}

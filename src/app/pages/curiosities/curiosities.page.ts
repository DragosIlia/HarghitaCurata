/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ICuriosity } from 'src/app/interfaces/ICuriosity';
import { IPaginated } from 'src/app/interfaces/IPaginated';
import { CuriositiesService } from '../../services/curiosities/curiosities.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-curiosities',
    templateUrl: './curiosities.page.html',
    styleUrls: ['./curiosities.page.scss'],
})
export class CuriositiesPage implements OnInit {
    public data: string;
    public pageNumber = 1;
    public pageSize = 5;
    public pagination: IPaginated | undefined;

    public curiosities: ICuriosity[] = [];

    constructor(private curiositiesService: CuriositiesService) { }

    ngOnInit() {
        this.getCuriosities();
    }

    getCuriosities() {
        setTimeout(() => {
            this.curiositiesService.getCuriosities(this.pageNumber, this.pageSize).subscribe({
                next: response => {
                    if (response.result && response.pagination) {
                        this.pagination = response.pagination;
                        const shuffledResult = response.result.sort((a, b) => Math.random() - 0.5);
                        this.curiosities = this.curiosities.concat(shuffledResult);
                    }
                },
                error: error => {
                    console.log('Error from curiosities.component: ', error);
                }
            });
        }, 500);
    }

    onIonInfinite(event) {
        this.pageNumber++;
        this.getCuriosities();
        setTimeout(() => {
            event.target.complete();
            if(this.curiosities.length >= this.pagination.totalItems)
                event.target.disabled = true;
        }, 500);
    }

}

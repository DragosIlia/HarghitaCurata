/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { IComplaint } from 'src/app/interfaces/IComplaint';
import { ComplaintsService } from 'src/app/services/complaints/complaints.service';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-complaint-details',
    templateUrl: './complaint-details.page.html',
    styleUrls: ['./complaint-details.page.scss'],
})
export class ComplaintDetailsPage implements OnInit {
    public data: IComplaint;
    public locale: string = 'en';
    constructor(private complaintsService: ComplaintsService, private languageService: LanguageService) { }

    ngOnInit() {
        this.getLocaleData();
    }

    getLocaleData() {
        this.languageService.getLocale().subscribe(res => {
            this.locale = res;
            this.readComplaint();
        });
    }

    readComplaint() {
        if(!this.data || this.data.state !== 3 || this.data.read) return;

        this.complaintsService.readComplaint(this.data.id).subscribe({
            next: () => {
                this.data.read = true;
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

}

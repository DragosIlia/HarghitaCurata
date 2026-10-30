/* eslint-disable max-len */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { IComplaint } from 'src/app/interfaces/IComplaint';
import { ComplaintsService } from 'src/app/services/complaints/complaints.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ComplaintDetailsPage } from '../complaint-details/complaint-details.page';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-complaint-history',
    templateUrl: './complaint-history.page.html',
    styleUrls: ['./complaint-history.page.scss'],
})
export class ComplaintHistoryPage implements OnInit {
    public data: IComplaint[];
    public locale: string = 'en';
    constructor(private languageService: LanguageService, private complaintsService: ComplaintsService, private modalService: ModalService) { }

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
            this.getComplaints();
        }, 2000);
    };

    getComplaints() {
        this.complaintsService.getComplaints().subscribe({
            next: (res) => {
                this.data = res;
            },
            error: (err) => {
                console.log(err);
                this.data = [];
            }
        });
    }

    viewComplaint(complaint: IComplaint) {
        if(!complaint) return;

        this.openModal(ComplaintDetailsPage, complaint);
    }

    async openModal(componentRef, data = null) {
        if (componentRef === null) return;
        await this.modalService.openModal(componentRef, data);
    }

}

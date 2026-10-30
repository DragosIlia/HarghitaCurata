/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { PrivacyPage } from '../privacy/privacy.page';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language/language.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-terms',
    templateUrl: './terms.page.html',
    styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit, OnDestroy {
    public loadingTerms: boolean = true;
    public currentLanguage: string = null;
    public languageSubscription: Subscription = null;

    constructor(private modalService: ModalService, private languageService: LanguageService) { }

    ngOnInit() {
        this.getMainLanguage();
    }

    ngOnDestroy() {
        this.resetTerms();
    }

    resetTerms() {
        if(this.languageSubscription) {
            this.languageSubscription.unsubscribe();
            this.languageSubscription = null;
        }
    }

    getMainLanguage() {
        this.languageSubscription = this.languageService.getLanguage().subscribe(language => {
            this.currentLanguage = language;
            this.initTerms();
        });
    }

    initTerms() {
        setTimeout(() => {
            this.loadingTerms = false;
        }, 500);
    }

    async openPrivacyModal() {
        await this.modalService.openModal(PrivacyPage);
    }

}

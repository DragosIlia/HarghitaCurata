/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal/modal.service';
import { LanguageService } from '../../services/language/language.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-privacy',
    templateUrl: './privacy.page.html',
    styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit, OnDestroy {
    public loadingPrivacy: boolean = true;
    public currentLanguage: string = null;
    public languageSubscription: Subscription = null;
    constructor(private modalService: ModalService, private languageService: LanguageService) { }

    ngOnInit() {
        this.getMainLanguage();
    }

    ngOnDestroy() {
        this.resetPrivacy();
    }

    resetPrivacy() {
        if (this.languageSubscription) {
            this.languageSubscription.unsubscribe();
            this.languageSubscription = null;
        }
    }

    getMainLanguage() {
        this.languageSubscription = this.languageService.getLanguage().subscribe(language => {
            this.currentLanguage = language;
            this.initPrivacy();
        });
    }

    initPrivacy() {
        setTimeout(() => {
            this.loadingPrivacy = false;
        }, 500);
    }

}

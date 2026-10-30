/* eslint-disable max-len */
/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language/language.service';
import languages from '../../helpers/language-names.json';
import { ILanguage } from 'src/app/interfaces/ILanguage';
import { LoaderService } from '../../services/loader/loader.service';
import { Subscription } from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-language',
    templateUrl: './language.page.html',
    styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit, OnDestroy {
    public availableLanguages: ILanguage[] = [];
    public currentLanguage: string;
    public languageSubscribe: Subscription;

    constructor(private languageService: LanguageService, private loaderService: LoaderService) { }

    ngOnInit() {
        this.initializeLanguages();
    }

    ngOnDestroy() {
        this.languageSubscribe.unsubscribe();
    }

    initializeLanguages() {
        this.languageSubscribe = this.languageService.getLanguage().subscribe(lang => {
            const translateLangs = this.languageService.translate.getLangs();
            this.currentLanguage = lang;

            translateLangs.forEach(x => {
                const findLanguage = languages[x];
                if (findLanguage !== undefined && findLanguage !== null)
                    this.availableLanguages.push({
                        shortname: x,
                        name: findLanguage.nativeName,
                        checked: this.currentLanguage === x
                    });
            });
        });
    }

    async changeLanguage(event) {
        const value = event.detail.value;
        if (value === this.currentLanguage) {
            event.target.checked = true;
            return;
        }
        this.availableLanguages = [];
        await this.loaderService.showLoader();
        await this.languageService.setLanguage(value);
        await this.loaderService.hideLoader();
    }
}

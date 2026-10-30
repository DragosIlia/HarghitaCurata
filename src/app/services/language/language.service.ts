/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

export const LANGUAGE_KEY = 'language';

@Injectable({
    providedIn: 'root'
})

export class LanguageService {
    public availableLanguages: string[] = ['ro', 'gb', 'hu'];
    public currentLanguage: BehaviorSubject<string> = new BehaviorSubject(null);
    public currentLocale: BehaviorSubject<string> = new BehaviorSubject('en');
    constructor(public translate: TranslateService, private storageService: StorageService, private http: HttpClient) { }

    async initialize() {
        this.translate.addLangs(this.availableLanguages);

        const language = await this.storageService.getStorageKey(LANGUAGE_KEY);
        const languageToUse = language && language.value !== null ? language.value : this.translate.getBrowserLang();
        const fileURL = `./assets/i18n/${languageToUse}.json`;
        try {
            this.fileExists(fileURL).subscribe(exists => {
                if (exists) this.setLanguage(languageToUse);
                else {
                    console.log('Language file does not exist!');
                    this.setLanguage('gb');
                }
            });
        } catch (e) {
            this.setLanguage('gb');
            console.log(e);
        }
    }

    async setLanguage(language: string) {
        if (language === null || language === undefined) return;

        const locale = (language === 'gb') ? 'en' : language;
        this.currentLocale.next(locale);
        this.currentLanguage.next(language);
        this.translate.use(language);
        await this.storageService.setStorageKey(LANGUAGE_KEY, language);
    }

    fileExists(url: string): Observable<boolean> {
        return this.http.get(url).pipe(map(() => true), catchError(() => of(false)));
    }

    getLanguage() {
        return this.currentLanguage;
    }

    getLocale() {
        return this.currentLocale;
    }
}

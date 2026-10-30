/* eslint-disable curly */
/* eslint-disable max-len */
import { AfterViewInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { SearchbarCustomEvent } from '@ionic/angular/lazy';
import { IGuide, IGuideDetails } from '../../interfaces/IGuide';
import { GuideDetailsPage } from '../guide-details/guide-details.page';
import { GuideService } from '../../services/guide/guide.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal/modal.service';
import { LanguageService } from '../../services/language/language.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-guide',
    templateUrl: 'guide.page.html',
    styleUrls: ['guide.page.scss']
})
export class GuidePage {
    public collectionGuide: IGuide[] = [];
    public filteredGuide: IGuide[] = [];
    public guideSubscription: Subscription = null;

    public currentLanguage: string = null;

    constructor(private modalService: ModalService, private guideService: GuideService, private languageService: LanguageService) { }

    ionViewDidEnter() {
        this.getMainLanguage();
    }

    ionViewDidLeave() {
        this.resetGuide();
    }

    getMainLanguage() {
        this.languageService.getLanguage().subscribe(language => {
            this.currentLanguage = language;
            this.getGuide();
        });
    }

    resetGuide() {
        if(this.guideSubscription) this.guideSubscription.unsubscribe();
        this.collectionGuide = [];
        this.filteredGuide = [];
    }

    getGuide() {
        this.guideSubscription = this.guideService.getItems().subscribe(items => {
            let itemsFiltered = items.filter(x => x.state === 1);
            if(this.currentLanguage === 'ro') {
                this.collectionGuide = itemsFiltered;
                this.filteredGuide = this.collectionGuide;
                return;
            }

            itemsFiltered.forEach(x=> {
                x.name = x[`name${this.currentLanguage.charAt(0).toUpperCase() + this.currentLanguage.slice(1)}`];
                x.details = x[`details${this.currentLanguage.charAt(0).toUpperCase() + this.currentLanguage.slice(1)}`];
            });
            itemsFiltered = itemsFiltered.sort((a, b) => (a.name < b.name ? -1 : 1));
            this.collectionGuide = itemsFiltered;
            this.filteredGuide = this.collectionGuide;
        });
    }

    viewInformation(item: IGuide) {
        const modelItem: IGuideDetails = { item, language: this.currentLanguage };
        this.openModal(GuideDetailsPage, modelItem);
    }

    async openModal(componentRef, data = null) {
        if (componentRef === null) return;
        await this.modalService.openModal(componentRef, data);
    }

    filter(event: SearchbarCustomEvent) {
        const filter = event.detail.value.toLowerCase();
        const filterWithoutDiacritics = filter.normalize('NFKD').replace(/[^\w]/g, '');
        this.filteredGuide = this.collectionGuide.filter(item =>
            (item.name && item.name.length > 0 && item.name.toLowerCase().normalize('NFKD').replace(/[^\w]/g, '').indexOf(filterWithoutDiacritics) >= 0) ||
            (item.details && item.details.length > 0 && item.details.toLowerCase().normalize('NFKD').replace(/[^\w]/g, '').indexOf(filterWithoutDiacritics) >= 0)
        );
    }
}

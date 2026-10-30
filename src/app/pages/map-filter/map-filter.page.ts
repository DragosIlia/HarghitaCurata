/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { CentreService } from '../../services/centre/centre.service';
import { ICollectionCentreFraction } from 'src/app/interfaces/ICollectionCentre';
import { LanguageService } from '../../services/language/language.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { HeaderModule } from 'src/app/components/header/header.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: true,
    imports:[CommonModule, IonicModule, HeaderModule, TranslatePipe],
    selector: 'app-map-filter',
    templateUrl: './map-filter.page.html',
    styleUrls: ['./map-filter.page.scss'],
})
export class MapFilterPage implements OnInit {
    public currentLanguage: string = null;
    @Input() data: ICollectionCentreFraction[] = [];

    constructor(private centreService: CentreService, private languageService: LanguageService) { }

    ngOnInit() {
        this.getMainLanguage();
    }

    getMainLanguage() {
        this.languageService.getLanguage().subscribe(language => {
            this.currentLanguage = language;
        });
    }

    hexToRGB(fractionId) {
        const findFraction = this.data.find((fraction: ICollectionCentreFraction) => fraction.id === fractionId);
        if (!findFraction) return '#000';


        const r = parseInt(findFraction.color.slice(1, 3), 16);
        const g = parseInt(findFraction.color.slice(3, 5), 16);
        const b = parseInt(findFraction.color.slice(5, 7), 16);

        const alpha = findFraction.selected ? 1 : 0.4;
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }

    markFraction(fraction: ICollectionCentreFraction) {
        fraction.selected = !fraction.selected;
        this.centreService.setFractions(this.data);
    }
}

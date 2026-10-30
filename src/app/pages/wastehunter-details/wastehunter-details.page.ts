/* eslint-disable max-len */
import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { openNavigation } from '../../helpers/open-navigation';
import { Subscription } from 'rxjs';
import { IWasteHunter } from '../../interfaces/IWasteHunter';
import { WasteHunterService } from '../../services/waste-hunter/waste-hunter.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-wastehunter-details',
    templateUrl: './wastehunter-details.page.html',
    styleUrls: ['./wastehunter-details.page.scss'],
})
export class WastehunterDetailsPage implements OnInit, OnDestroy {
    public data: IWasteHunter;
    public previewImage: string = undefined;
    public previewSubscription: Subscription = null;
    constructor(private wasteHunterService: WasteHunterService) { }

    ngOnInit() {
        this.getPreviewImage();
    }

    ngOnDestroy() {
        this.destroyPreviewImage();
    }

    destroyPreviewImage() {
        console.log('Destroying preview of waste image...');
        if (this.previewSubscription !== null) {
            this.previewSubscription.unsubscribe();
            this.previewSubscription = null;
        }
        this.previewImage = undefined;
    }

    getPreviewImage() {
        console.log('Getting preview of waste image...');
        this.previewSubscription = this.wasteHunterService.getImage(this.data.id).subscribe({
            next: response => {
                this.previewImage = response;
            },
            error: error => {
                console.log('Error from wastehunter-details.component: ', error);
                this.previewImage = null;
            }
        });
    }

    navigateToEntry() {
        void openNavigation(this.data.gpsLatitude, this.data.gpsLongitude);
    }

}

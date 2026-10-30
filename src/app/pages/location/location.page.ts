/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { LocationService } from '../../services/location/location.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-location',
    templateUrl: './location.page.html',
    styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
    public preciseNeeded = false;
    constructor(private locationService: LocationService) { }

    ngOnInit() {
        this.locationService.preciseNeeded.subscribe((preciseNeeded) => {
            this.preciseNeeded = preciseNeeded;
        });
    }

    enableLocation() {
        console.log('Enable location...');
        this.locationService.enableLocation();
    }

}

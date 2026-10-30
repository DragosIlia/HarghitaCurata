import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-support',
    templateUrl: './support.page.html',
    styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}

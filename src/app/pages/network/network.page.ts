import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-network',
    templateUrl: './network.page.html',
    styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}

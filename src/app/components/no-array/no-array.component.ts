import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-no-array',
    templateUrl: './no-array.component.html',
    styleUrls: ['./no-array.component.scss'],
})
export class NoArrayComponent implements OnInit {
    @Input() content: string;
    @Input() hasPadding: boolean;
    @Input() icon: string = null;
    constructor() { }

    ngOnInit() { }

}

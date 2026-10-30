import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular/lazy';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    @ViewChild(IonTabs) tabs: IonTabs;
    public selectedTab: string;
    public isLogged = false;

    constructor(private authService: AuthenticationService) {
        this.checkAuth();
    }

    checkAuth() {
        this.authService.isLogged().subscribe(logged => {
            this.isLogged = logged;
        });
    }

    setSelectedTab() {
        this.selectedTab = this.tabs.getSelected();
    }
}

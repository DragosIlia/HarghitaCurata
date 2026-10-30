import { Component, ChangeDetectionStrategy, Input, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular/lazy';
import { ModalService } from '../../services/modal/modal.service';
import { NotificationsPage } from '../../pages/notifications/notifications.page';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    @Input() iconName: string;
    @Input() title: string;
    @Input() enableTitle = false;
    @Input() enableImage = false;
    @Input() isModal = false;
    public isLogged = false;
    constructor(private modalService: ModalService, private authService: AuthenticationService) { }

    ngOnInit() {
        this.checkAuth();
    }

    checkAuth() {
        this.authService.isLogged().subscribe(logged => {
            this.isLogged = logged;
        });
    }

    async moveToNotifications() {
        const componentRef = NotificationsPage;
        await this.modalService.openModal(componentRef);
    }

    closeModal() {
        return this.modalService.closeModal();
    }
}

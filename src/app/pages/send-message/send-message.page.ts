/* eslint-disable curly */
/* eslint-disable max-len */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IUser } from 'src/app/interfaces/IUser';
import { LoaderService } from '../../services/loader/loader.service';
import { ComplaintsService } from '../../services/complaints/complaints.service';
import { ModalService } from '../../services/modal/modal.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserDetailsService } from '../../services/user-details/user-details.service';
import { IAddress } from '../../interfaces/IAddress';
import { IComplaint } from 'src/app/interfaces/IComplaint';
import { ComplaintHistoryPage } from '../complaint-history/complaint-history.page';
import { ToastController } from '@ionic/angular/lazy';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-send-message',
    templateUrl: './send-message.page.html',
    styleUrls: ['./send-message.page.scss'],
})
export class SendMessagePage implements OnInit {
    public messageForm: FormGroup;
    public data: IUser;

    public categories: string[] = [
        'Send.Categories.NotLifted',
        'Send.Categories.Dustbin',
        'Send.Categories.Compliance',
        'Send.Categories.NotReceivedBags',
        'Send.Categories.Crew',
        'Send.Categories.Invoice',
        'Send.Categories.MixingWaste',
        'Send.Categories.Other',
    ];

    public userComplaints: IComplaint[] = [];

    public userAddresses: IAddress[] = [];

    constructor(private toastController: ToastController, private formBuilder: FormBuilder, private loaderService: LoaderService, private complaintsService: ComplaintsService, private modalService: ModalService, private toastService: ToastService, private translateService: TranslateService, private userDetailsService: UserDetailsService) { }

    ngOnInit() {
        this.initValidators();
        this.getAddresses();
        this.getComplaints();

        setTimeout(() => {
            this.helperTextbox();
        }, 200);
    }

    ionViewWillLeave() {
        this.toastController.dismiss();
    }

    async helperTextbox() {
        const toast = await this.toastController.create({
        message: this.translateService.instant('Errors.SendReclamation'),
        duration: 9000,
        position: 'top',
        color: 'warning',
        icon: 'alert-circle-outline'
        });
        await toast.present();
    }

    initValidators() {
        this.messageForm = this.formBuilder.group({
            userName: [''],
            title: ['', [Validators.required]],
            address: ['', [Validators.required]],
            message: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(400)]]
        });
    }

    getComplaints() {
        this.complaintsService.getComplaints().subscribe(res => {
            if(res)
                this.userComplaints = res;
        });
    }

    viewComplaintHistory() {
        this.openModal(ComplaintHistoryPage, this.userComplaints);
    }

    async openModal(componentRef, data = null) {
        if (componentRef === null) return;
        await this.modalService.openModal(componentRef, data);
    }

    hasUnreadComplaints() {
        if(!this.userComplaints) return false;
        const unreadComplaints = this.userComplaints.filter(x=> x.state === 3 && !x.read);
        if(!unreadComplaints) return false;

        return unreadComplaints.length > 0;
    }

    getUnreadComplaints() {
        if(!this.userComplaints) return 0;

        const unreadComplaints = this.userComplaints.filter(x=> x.state === 3 && !x.read);
        if(!unreadComplaints) return 0;

        return unreadComplaints.length;
    }

    getAddresses() {
        const addresses = this.userDetailsService.getAllAddresses();
        this.userAddresses = addresses;
    }

    async sendMessage() {
        const messageValues = this.messageForm.value;
        messageValues.userName = this.data?.userName;
        await this.loaderService.showLoader();
        this.complaintsService.sendMessage(messageValues).subscribe(async (x) => {
            await this.modalService.closeModal();
            this.toastService.showToast(this.translateService.instant('Send.Success'), 'checkmark-circle-outline', 2000, 'top', 'success');
            await this.loaderService.hideLoader();
        });
    }

}

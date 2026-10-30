/* eslint-disable max-len */
/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { IUser } from '../../interfaces/IUser';
import { UserDetailsService } from '../../services/user-details/user-details.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader/loader.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
    changeDetection: ChangeDetectionStrategy.Default,


    standalone: false,
    selector: 'app-account-details',
    templateUrl: './account-details.page.html',
    styleUrls: ['./account-details.page.scss'],
})
export class AccountDetailsPage implements OnInit {
    public data: IUser;
    public accountDetailsForm: FormGroup;

    constructor(private modalService: ModalService, private formBuilder: FormBuilder, private loaderService: LoaderService, private userDetailsService: UserDetailsService, private toastService: ToastService, private translateService: TranslateService) { }

    ngOnInit() {
        this.initValidators();
    }

    initValidators() {
        this.accountDetailsForm = this.formBuilder.group({
            firstName: [this.data.firstName, [Validators.required]],
            lastName: [this.data.lastName, [Validators.required]],
            phoneNumber: [this.data.phoneNumber, [Validators.required]],
            oldPassword: [''],
            newPassword: [''],
        });
    }

    async saveDetails() {
        const accountDetailsForm = this.accountDetailsForm.value;
        await this.loaderService.showLoader();
        this.userDetailsService.saveDetails(accountDetailsForm).subscribe(
            async (x) => {
                await this.modalService.closeModal(x);
                this.toastService.showToast(this.translateService.instant('Details.Success'), 'checkmark-circle-outline', 2000, 'top', 'success');
                await this.loaderService.hideLoader();
            },
            async (err) => {
                console.log(err);
                this.toastService.showToast(this.translateService.instant(err.error), 'alert-circle-outline', 3000, 'top', 'danger');
                await this.loaderService.hideLoader();
            }
        );
    }
}

/* eslint-disable max-len */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-reset',
    templateUrl: './reset.page.html',
    styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
    public resetForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private toastService: ToastService, private translateService: TranslateService) { }

    ngOnInit() {
        this.initValidators();
    }

    initValidators() {
        this.resetForm = this.formBuilder.group({
            accessCode: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(35)]],
            confirmNewPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(35)]],
        });
    }

    changePassword() {
        if (!this.validPasswords()) {
            this.toastService.showToast(this.translateService.instant('Reset.IdenticalPasswords'), 'alert-circle-outline', 3000, 'top', 'danger');
            return;
        }

        this.authenticationService.reset(this.resetForm.value);
    }

    validPasswords() {
        const password = this.resetForm.value.newPassword;
        const confirmPassword = this.resetForm.value.confirmNewPassword;
        return (password === confirmPassword);
    }

}

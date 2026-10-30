/* eslint-disable max-len */
/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast/toast.service';
import { ModalService } from '../../services/modal/modal.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TermsPage } from '../terms/terms.page';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { PrivacyPage } from '../privacy/privacy.page';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
    public readonly passwordMinLength = 6;
    public readonly passwordMaxLength = 35;
    public registerForm: FormGroup;

    constructor(private authenticationService: AuthenticationService,private modalService: ModalService, private toastService: ToastService, private formBuilder: FormBuilder, private translateService: TranslateService) { }

    ngOnInit() {
        this.initValidators();
    }

    initValidators() {
        this.registerForm = this.formBuilder.group({
            username: ['', [RegisterPage.requiredTrimmed(), Validators.minLength(2), Validators.maxLength(24)]],
            email: ['', [RegisterPage.requiredTrimmed(), Validators.maxLength(254), Validators.email]],
            password: ['', [RegisterPage.requiredTrimmed(), Validators.minLength(this.passwordMinLength), Validators.maxLength(this.passwordMaxLength)]],
            confirmPassword: ['', [RegisterPage.requiredTrimmed(), Validators.minLength(this.passwordMinLength), Validators.maxLength(this.passwordMaxLength)]],
            firstName: ['', [RegisterPage.requiredTrimmed(), Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[A-Za-zĂÂÎȘŞȚŢăâîșşțţ]+(?:[ '-.][A-Za-zĂÂÎȘŞȚŢăâîșşțţ]+)*$/)]],
            lastName: ['', [RegisterPage.requiredTrimmed(), Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[A-Za-zĂÂÎȘŞȚŢăâîșşțţ]+(?:[ '-.][A-Za-zĂÂÎȘŞȚŢăâîșşțţ]+)*$/)]],
            phoneNumber: ['', [RegisterPage.requiredTrimmed(), RegisterPage.phoneNumberValidator(7, 15)]],
            termsAccepted: [false, [Validators.requiredTrue]]
        }, {
            validators: [RegisterPage.passwordsMatchValidator('password', 'confirmPassword')]
        });
    }

    signUp() {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            if (this.registerForm.errors?.passwordMismatch) {
                this.toastService.showToast(this.translateService.instant('Register.Identical'), 'alert-circle-outline', 3000, 'top', 'danger');
            } else if (this.registerForm.controls.termsAccepted.errors?.required) {
                this.toastService.showToast(this.translateService.instant('Register.TermsAccepted'), 'alert-circle-outline', 3000, 'top', 'danger');
            }
            return;
        }
        this.authenticationService.register(this.getSanitizedPayload());
    }

    getSanitizedPayload() {
        const {
            termsAccepted, ...payload
        } = this.registerForm.getRawValue();
        return {
            ...payload,
            username: payload.username.trim(),
            email: payload.email.trim().toLowerCase(),
            firstName: payload.firstName.trim(),
            lastName: payload.lastName.trim(),
            phoneNumber: payload.phoneNumber.trim().replace(/\s+/g, ' ')
        };
    }

    handleTerms() {
        this.openModal(TermsPage);
    }

    handlePolicy() {
        this.openModal(PrivacyPage);
    }

    async openModal(componentRef, data = null) {
        if (componentRef === null) return;
        await this.modalService.openModal(componentRef, data);
    }

    get passwordControl(): AbstractControl | null {
        return this.registerForm?.get('password');
    }

    get confirmPasswordControl(): AbstractControl | null {
        return this.registerForm?.get('confirmPassword');
    }

    shouldShowPasswordError(): boolean {
        return !!this.passwordControl?.invalid && !!(this.passwordControl?.dirty || this.passwordControl?.touched);
    }

    shouldShowConfirmPasswordError(): boolean {
        return !!this.confirmPasswordControl?.invalid && !!(this.confirmPasswordControl?.dirty || this.confirmPasswordControl?.touched);
    }

    shouldShowPasswordMismatchError(): boolean {
        if (!this.registerForm?.errors?.passwordMismatch) return false;
        if (this.passwordControl?.invalid || this.confirmPasswordControl?.invalid) return false;
        return !!(this.passwordControl?.dirty || this.passwordControl?.touched || this.confirmPasswordControl?.dirty || this.confirmPasswordControl?.touched);
    }

    isSubmitDisabled(): boolean {
        if (!this.registerForm) return true;
        return Object.values(this.registerForm.controls).some((control) => control.invalid);
    }

    static requiredTrimmed(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (typeof value !== 'string') return null;
            return value.trim().length > 0 ? null : { required: true };
        };
    }

    static passwordsMatchValidator(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get(passwordControlName)?.value;
            const confirmPassword = control.get(confirmPasswordControlName)?.value;
            return password === confirmPassword ? null : { passwordMismatch: true };
        };
    }

    static phoneNumberValidator(minDigits: number, maxDigits: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (typeof value !== 'string') return null;
            const sanitizedValue = value.trim();
            const validCharacters = /^[0-9+()\- ]+$/.test(sanitizedValue);
            if (!validCharacters) return { phoneFormat: true };
            const digitCount = (sanitizedValue.match(/\d/g) || []).length;
            if (digitCount < minDigits || digitCount > maxDigits) return { phoneLength: true };
            return null;
        };
    }
}

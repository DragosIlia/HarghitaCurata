/* eslint-disable max-len */
/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../services/toast/toast.service';
import { LoaderService } from '../../services/loader/loader.service';
import { HttpClient } from '@angular/common/http';
import { RegisterPage } from '../register/register.page';
import { RecoveryPage } from '../recovery/recovery.page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ModalService } from '../../services/modal/modal.service';
import { IonInput } from '@ionic/angular/lazy';
import { TranslateService } from '@ngx-translate/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    @ViewChild('usernameInput', { static: false }) usernameInput: IonInput;
    public loginForm: FormGroup;

    constructor(private toastService: ToastService, private loaderService: LoaderService, private http: HttpClient, private formBuilder: FormBuilder, private authService: AuthenticationService, private modalService: ModalService, private translateService: TranslateService) { }

    ngOnInit() {
        this.initValidators();
        setTimeout(() => { this.usernameInput?.setFocus(); }, 250);
    }

    initValidators() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
            loginType: ['mobile'],
        });
    }

    async openModal(component) {
        const componentRef = (component === 'register') ? RegisterPage : RecoveryPage;
        await this.modalService.openModal(componentRef);
    }

    async login() {
        await this.loaderService.showLoader();
        this.authService.login(this.loginForm.value).subscribe(
            async _ => {
                await this.loaderService.hideLoader();
                await this.modalService.closeModal();
            },
            async (err) => {
                console.log(err);
                this.toastService.showToast(this.translateService.instant(err.error), 'alert-circle-outline', 3000, 'top', 'danger');
                await this.loaderService.hideLoader();
            }
        );
    }
}

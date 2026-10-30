/* eslint-disable max-len */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-recovery',
    templateUrl: './recovery.page.html',
    styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage implements OnInit {
    public recoveryForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { }

    ngOnInit() {
        this.initValidators();
    }

    initValidators() {
        this.recoveryForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        });
    }

    sendCode() {
        this.authenticationService.recovery(this.recoveryForm.value);
    }
}

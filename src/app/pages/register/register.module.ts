import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { RegisterPageRoutingModule } from './register-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { RegisterPage } from './register.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';
import { PasswordModule } from '../../components/password/password.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegisterPageRoutingModule,
        HttpClientModule,
        TranslatePipe,
        HeaderModule,
        PasswordModule,
        ReactiveFormsModule
    ],
    declarations: [RegisterPage],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class RegisterPageModule { }

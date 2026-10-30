import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { AccountDetailsPageRoutingModule } from './account-details-routing.module';

import { AccountDetailsPage } from './account-details.page';

import { TranslatePipe } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from '../../components/header/header.module';
import { PasswordModule } from '../../components/password/password.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AccountDetailsPageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe,
        ReactiveFormsModule,
        PasswordModule,
    ],
    declarations: [AccountDetailsPage]
})
export class AccountDetailsPageModule { }

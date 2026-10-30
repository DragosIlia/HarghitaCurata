import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ResetPageRoutingModule } from './reset-routing.module';

import { ResetPage } from './reset.page';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/components/header/header.module';
import { PasswordModule } from '../../components/password/password.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ResetPageRoutingModule,
        HttpClientModule,
        TranslatePipe,
        HeaderModule,
        PasswordModule,
        ReactiveFormsModule
    ],
    declarations: [ResetPage]
})
export class ResetPageModule { }

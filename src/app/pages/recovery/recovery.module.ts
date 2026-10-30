import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { RecoveryPageRoutingModule } from './recovery-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { RecoveryPage } from './recovery.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RecoveryPageRoutingModule,
        HttpClientModule,
        TranslatePipe,
        HeaderModule,
        ReactiveFormsModule
    ],
    declarations: [RecoveryPage],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class RecoveryPageModule { }

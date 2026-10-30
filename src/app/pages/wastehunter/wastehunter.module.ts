import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { WastehunterPageRoutingModule } from './wastehunter-routing.module';

import { WastehunterPage } from './wastehunter.page';
import { HeaderModule } from '../../components/header/header.module';
import { TranslatePipe } from '@ngx-translate/core';
import { NoArrayModule } from '../../components/no-array/no-array.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HeaderModule,
        WastehunterPageRoutingModule,
        TranslatePipe,
        NoArrayModule
    ],
    declarations: [WastehunterPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WastehunterPageModule { }

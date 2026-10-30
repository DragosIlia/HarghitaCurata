import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { WastehunterDetailsPageRoutingModule } from './wastehunter-details-routing.module';

import { WastehunterDetailsPage } from './wastehunter-details.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WastehunterDetailsPageRoutingModule,
        TranslatePipe,
        HeaderModule
    ],
    declarations: [WastehunterDetailsPage]
})
export class WastehunterDetailsPageModule { }

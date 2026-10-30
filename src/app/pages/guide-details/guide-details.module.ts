import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { GuideDetailsPageRoutingModule } from './guide-details-routing.module';

import { GuideDetailsPage } from './guide-details.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GuideDetailsPageRoutingModule,
        TranslatePipe,
        HeaderModule
    ],
    declarations: [GuideDetailsPage]
})
export class GuideDetailsPageModule { }

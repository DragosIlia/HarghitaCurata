import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ComplaintDetailsPageRoutingModule } from './complaint-details-routing.module';

import { ComplaintDetailsPage } from './complaint-details.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComplaintDetailsPageRoutingModule,
        TranslatePipe,
        HeaderModule
    ],
    declarations: [ComplaintDetailsPage]
})
export class ComplaintDetailsPageModule { }

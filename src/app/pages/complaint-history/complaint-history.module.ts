import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ComplaintHistoryPageRoutingModule } from './complaint-history-routing.module';

import { ComplaintHistoryPage } from './complaint-history.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComplaintHistoryPageRoutingModule,
        TranslatePipe,
        HeaderModule
    ],
    declarations: [ComplaintHistoryPage]
})
export class ComplaintHistoryPageModule { }

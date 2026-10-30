import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuidePage } from './guide.page';

import { GuidePageRoutingModule } from './guide-routing.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        HeaderModule,
        RouterModule.forChild([{ path: '', component: GuidePage }]),
        GuidePageRoutingModule,
        TranslatePipe,
    ],
    declarations: [GuidePage]
})
export class GuidePageModule { }

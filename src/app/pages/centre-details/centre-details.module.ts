import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { CentreDetailsPageRoutingModule } from './centre-details-routing.module';

import { CentreDetailsPage } from './centre-details.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';
import { NoArrayModule } from 'src/app/components/no-array/no-array.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CentreDetailsPageRoutingModule,
        TranslatePipe,
        HeaderModule,
        NoArrayModule
    ],
    declarations: [CentreDetailsPage]
})
export class CentreDetailsPageModule { }

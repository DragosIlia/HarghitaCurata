import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { CuriositiesPageRoutingModule } from './curiosities-routing.module';

import { CuriositiesPage } from './curiosities.page';
import { HeaderModule } from '../../components/header/header.module';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CuriositiesPageRoutingModule,
        HeaderModule,
        TranslatePipe
    ],
    declarations: [CuriositiesPage]
})
export class CuriositiesPageModule { }

import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapPage } from './map.page';

import { MapPageRoutingModule } from './map-routing.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        HeaderModule,
        MapPageRoutingModule,
        TranslatePipe,
    ],
    declarations: [MapPage]
})
export class MapPageModule { }

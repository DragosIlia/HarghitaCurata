import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { MapFilterPageRoutingModule } from './map-filter-routing.module';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MapFilterPageRoutingModule,
        TranslatePipe,
        
    ],
    declarations: []
})
export class MapFilterPageModule { }

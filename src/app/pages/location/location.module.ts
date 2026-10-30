import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { LocationPageRoutingModule } from './location-routing.module';

import { LocationPage } from './location.page';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LocationPageRoutingModule,
        TranslatePipe
    ],
    declarations: [LocationPage]
})
export class LocationPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { CityListPageRoutingModule } from './city-list-routing.module';

import { CityListPage } from './city-list.page';
import { HeaderModule } from '../../components/header/header.module';
import { TranslatePipe } from '@ngx-translate/core';
import { NoArrayModule } from '../../components/no-array/no-array.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CityListPageRoutingModule,
        HeaderModule,
        TranslatePipe,
        NoArrayModule
    ],
    declarations: [CityListPage]
})
export class CityListPageModule { }

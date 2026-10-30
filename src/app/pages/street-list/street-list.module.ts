import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { StreetListPageRoutingModule } from './street-list-routing.module';

import { StreetListPage } from './street-list.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StreetListPageRoutingModule,
        HeaderModule,
        TranslatePipe
    ],
    declarations: [StreetListPage]
})
export class StreetListPageModule { }

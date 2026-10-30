import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ZoneListPageRoutingModule } from './zone-list-routing.module';

import { ZoneListPage } from './zone-list.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ZoneListPageRoutingModule,
        HeaderModule,
        TranslatePipe,
    ],
    declarations: [ZoneListPage]
})
export class ZoneListPageModule { }

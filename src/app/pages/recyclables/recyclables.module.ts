import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { RecyclablesPageRoutingModule } from './recyclables-routing.module';

import { RecyclablesPage } from './recyclables.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RecyclablesPageRoutingModule,
        TranslatePipe,
        HeaderModule,
    ],
    declarations: [RecyclablesPage]
})
export class RecyclablesPageModule { }

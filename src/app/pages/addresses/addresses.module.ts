import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { AddressesPageRoutingModule } from './addresses-routing.module';
import { AddressesPage } from './addresses.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { NoArrayModule } from '../../components/no-array/no-array.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddressesPageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe,
        NoArrayModule
    ],
    declarations: [AddressesPage]
})
export class AddressesPageModule { }

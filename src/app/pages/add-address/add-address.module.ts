import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { AddAddressPageRoutingModule } from './add-address-routing.module';
import { AddAddressPage } from './add-address.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from '../../components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddAddressPageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe,
        ReactiveFormsModule
    ],
    declarations: [AddAddressPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddAddressPageModule { }

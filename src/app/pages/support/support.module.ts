import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { SupportPageRoutingModule } from './support-routing.module';
import { SupportPage } from './support.page';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SupportPageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe
    ],
    declarations: [SupportPage]
})
export class SupportPageModule { }

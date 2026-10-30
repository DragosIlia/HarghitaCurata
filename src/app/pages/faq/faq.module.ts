import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';
import { FaqPageRoutingModule } from './faq-routing.module';
import { FaqPage } from './faq.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FaqPageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe
    ],
    declarations: [FaqPage]
})
export class FaqPageModule { }

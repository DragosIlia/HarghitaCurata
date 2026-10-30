import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { PrivacyPageRoutingModule } from './privacy-routing.module';
import { PrivacyPage } from './privacy.page';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';
import { NoArrayModule } from 'src/app/components/no-array/no-array.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PrivacyPageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe,
        NoArrayModule
    ],
    declarations: [PrivacyPage]
})
export class PrivacyPageModule { }

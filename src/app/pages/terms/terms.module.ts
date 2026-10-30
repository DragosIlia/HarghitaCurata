import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { TermsPageRoutingModule } from './terms-routing.module';
import { TermsPage } from './terms.page';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';
import { NoArrayModule } from '../../components/no-array/no-array.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TermsPageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe,
        NoArrayModule
    ],
    declarations: [TermsPage]
})
export class TermsPageModule { }

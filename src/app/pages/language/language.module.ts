import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { LanguagePageRoutingModule } from './language-routing.module';
import { LanguagePage } from './language.page';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from '../../components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LanguagePageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe
    ],
    declarations: [LanguagePage]
})
export class LanguagePageModule { }

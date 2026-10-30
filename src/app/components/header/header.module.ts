import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular/lazy';
import { HeaderComponent } from './header.component';

@NgModule({
    declarations: [HeaderComponent],
    imports: [
        IonicModule,
        CommonModule,
        HttpClientModule,
        TranslatePipe
    ],
    exports: [HeaderComponent]
})
export class HeaderModule { }


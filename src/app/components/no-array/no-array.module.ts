import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular/lazy';
import { NoArrayComponent } from './no-array.component';

@NgModule({
    declarations: [NoArrayComponent],
    imports: [
        IonicModule,
        CommonModule,
        HttpClientModule,
        TranslatePipe
    ],
    exports: [NoArrayComponent]
})
export class NoArrayModule { }


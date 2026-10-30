import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { PasswordComponent } from './password.component';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
    declarations: [PasswordComponent],
    imports: [
        IonicModule,
        CommonModule,
        HttpClientModule,
        TranslatePipe,
    ],
    exports: [PasswordComponent]
})
export class PasswordModule { }



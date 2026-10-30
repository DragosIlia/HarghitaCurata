import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { SendMessagePageRoutingModule } from './send-message-routing.module';
import { SendMessagePage } from './send-message.page';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SendMessagePageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe,
        ReactiveFormsModule
    ],
    declarations: [SendMessagePage]
})
export class SendMessagePageModule { }

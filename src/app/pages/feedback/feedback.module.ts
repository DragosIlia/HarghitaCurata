import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';
import { FeedbackPageRoutingModule } from './feedback-routing.module';
import { FeedbackPage } from './feedback.page';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FeedbackPageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe,
        ReactiveFormsModule
    ],
    declarations: [FeedbackPage]
})
export class FeedbackPageModule { }


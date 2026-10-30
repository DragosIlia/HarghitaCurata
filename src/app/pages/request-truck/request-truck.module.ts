import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RequestTruckPageRoutingModule } from './request-truck-routing.module';
import { RequestTruckPage } from './request-truck.page';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderModule } from '../../components/header/header.module';
import { NoArrayModule } from '../../components/no-array/no-array.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RequestTruckPageRoutingModule,
        HeaderModule,
        HttpClientModule,
        TranslatePipe,
        ReactiveFormsModule,
        NoArrayModule,
        PdfViewerModule
    ],
    declarations: [RequestTruckPage]
})
export class RequestTruckPageModule { }

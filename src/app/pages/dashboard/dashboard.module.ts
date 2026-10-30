/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { IonicModule } from '@ionic/angular/lazy';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { HeaderModule } from '../../components/header/header.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        HeaderModule,
        DashboardPageRoutingModule,
        HttpClientModule,
        TranslatePipe,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
    ],
    declarations: [DashboardPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPageModule { }

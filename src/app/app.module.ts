/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable max-len */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular/lazy';
import { IonicModule } from '@ionic/angular/lazy';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localeEN from '@angular/common/locales/en';
import localeHU from '@angular/common/locales/hu';
import localeRO from '@angular/common/locales/ro';

registerLocaleData(localeRO);
registerLocaleData(localeHU);
registerLocaleData(localeEN);

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideTranslateService({ loader: provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json', failOnError: true }), fallbackLang: 'gb' }),
    ],
    bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class AppModule { }



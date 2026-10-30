import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HeaderModule,
        RouterModule.forChild([{ path: '', component: ProfilePage }]),
        ProfilePageRoutingModule,
        HttpClientModule,
        TranslatePipe
    ],
    declarations: [ProfilePage]
})
export class ProfilePageModule { }

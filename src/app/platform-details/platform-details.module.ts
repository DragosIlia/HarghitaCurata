import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { PlatformDetailsPageRoutingModule } from './platform-details-routing.module';

import { PlatformDetailsPage } from './platform-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlatformDetailsPageRoutingModule,
  ],
  declarations: [PlatformDetailsPage]
})
export class PlatformDetailsPageModule {}

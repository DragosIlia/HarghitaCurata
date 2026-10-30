import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlatformDetailsPage } from './platform-details.page';

const routes: Routes = [
  {
    path: '',
    component: PlatformDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformDetailsPageRoutingModule {}

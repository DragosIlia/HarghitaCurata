import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuideDetailsPage } from './guide-details.page';

const routes: Routes = [
    {
        path: '',
        component: GuideDetailsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GuideDetailsPageRoutingModule { }

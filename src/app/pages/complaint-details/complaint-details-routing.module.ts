import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComplaintDetailsPage } from './complaint-details.page';

const routes: Routes = [
    {
        path: '',
        component: ComplaintDetailsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ComplaintDetailsPageRoutingModule { }

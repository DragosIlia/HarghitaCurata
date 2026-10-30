import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestTruckPage } from './request-truck.page';

const routes: Routes = [
    {
        path: '',
        component: RequestTruckPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequestTruckPageRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComplaintHistoryPage } from './complaint-history.page';

const routes: Routes = [
    {
        path: '',
        component: ComplaintHistoryPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ComplaintHistoryPageRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CentreDetailsPage } from './centre-details.page';

const routes: Routes = [
    {
        path: '',
        component: CentreDetailsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CentreDetailsPageRoutingModule { }

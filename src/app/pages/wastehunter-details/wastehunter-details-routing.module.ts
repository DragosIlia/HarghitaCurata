import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WastehunterDetailsPage } from './wastehunter-details.page';

const routes: Routes = [
    {
        path: '',
        component: WastehunterDetailsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WastehunterDetailsPageRoutingModule { }

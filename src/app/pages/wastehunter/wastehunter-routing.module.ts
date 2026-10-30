import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WastehunterPage } from './wastehunter.page';

const routes: Routes = [
    {
        path: '',
        component: WastehunterPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WastehunterPageRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuriositiesPage } from './curiosities.page';

const routes: Routes = [
    {
        path: '',
        component: CuriositiesPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CuriositiesPageRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapFilterPage } from './map-filter.page';

const routes: Routes = [
    {
        path: '',
        component: MapFilterPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MapFilterPageRoutingModule { }

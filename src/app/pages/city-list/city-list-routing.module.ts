import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CityListPage } from './city-list.page';

const routes: Routes = [
    {
        path: '',
        component: CityListPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CityListPageRoutingModule { }

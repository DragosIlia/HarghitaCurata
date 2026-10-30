import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StreetListPage } from './street-list.page';

const routes: Routes = [
    {
        path: '',
        component: StreetListPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StreetListPageRoutingModule { }

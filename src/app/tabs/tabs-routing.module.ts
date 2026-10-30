import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
            },
            {
                path: 'map',
                loadChildren: () => import('../pages/map/map.module').then(m => m.MapPageModule)
            },
            {
                path: 'wastehunter',
                loadChildren: () => import('../pages/wastehunter/wastehunter.module').then(m => m.WastehunterPageModule)
            },
            {
                path: 'guide',
                loadChildren: () => import('../pages/guide/guide.module').then(m => m.GuidePageModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
            },
            {
                path: '',
                redirectTo: '/menu/dashboard',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }

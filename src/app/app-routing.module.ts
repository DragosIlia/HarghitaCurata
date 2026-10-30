import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { WelcomeGuard } from './guards/welcome/welcome.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/menu/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'menu',
        loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
        canLoad: [WelcomeGuard]
    },
    {
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.module').then((m) => m.WelcomePageModule)
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
    },
    {
        path: 'register',
        loadChildren: () => import('./pages/register/register.module').then((m) => m.RegisterPageModule),
    },
    {
        path: 'recovery',
        loadChildren: () => import('./pages/recovery/recovery.module').then((m) => m.RecoveryPageModule),
    },
    {
        path: 'language',
        loadChildren: () => import('./pages/language/language.module').then(m => m.LanguagePageModule),
    },
    {
        path: 'support',
        loadChildren: () => import('./pages/support/support.module').then(m => m.SupportPageModule),
    },
    {
        path: 'terms',
        loadChildren: () => import('./pages/terms/terms.module').then(m => m.TermsPageModule),
    },
    {
        path: 'privacy',
        loadChildren: () => import('./pages/privacy/privacy.module').then(m => m.PrivacyPageModule),
    },
    {
        path: 'account-details',
        loadChildren: () => import('./pages/account-details/account-details.module').then(m => m.AccountDetailsPageModule),
    },
    {
        path: 'notifications',
        loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
    },
    {
        path: 'send-message',
        loadChildren: () => import('./pages/send-message/send-message.module').then(m => m.SendMessagePageModule)
    },
    {
        path: 'request-truck',
        loadChildren: () => import('./pages/request-truck/request-truck.module').then(m => m.RequestTruckPageModule)
    },
    {
        path: 'network',
        loadChildren: () => import('./pages/network/network.module').then(m => m.NetworkPageModule)
    },
    {
        path: 'add-address',
        loadChildren: () => import('./pages/add-address/add-address.module').then(m => m.AddAddressPageModule)
    },
    {
        path: 'guide-details',
        loadChildren: () => import('./pages/guide-details/guide-details.module').then(m => m.GuideDetailsPageModule)
    },
    {
        path: 'centre-details',
        loadChildren: () => import('./pages/centre-details/centre-details.module').then(m => m.CentreDetailsPageModule)
    },
    {
        path: 'feedback',
        loadChildren: () => import('./pages/feedback/feedback.module').then(m => m.FeedbackPageModule)
    },
    {
        path: 'faq',
        loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqPageModule)
    },
    {
        path: 'location',
        loadChildren: () => import('./pages/location/location.module').then(m => m.LocationPageModule)
    },
    {
        path: 'wastehunter-details',
        loadChildren: () => import('./pages/wastehunter-details/wastehunter-details.module').then(m => m.WastehunterDetailsPageModule)
    },
    {
        path: 'map-filter',
        loadChildren: () => import('./pages/map-filter/map-filter.module').then(m => m.MapFilterPageModule)
    },
    {
        path: 'reset',
        loadChildren: () => import('./pages/reset/reset.module').then(m => m.ResetPageModule)
    },
    {
        path: 'city-list',
        loadChildren: () => import('./pages/city-list/city-list.module').then(m => m.CityListPageModule)
    },
    {
        path: 'street-list',
        loadChildren: () => import('./pages/street-list/street-list.module').then(m => m.StreetListPageModule)
    },
    {
        path: 'zone-list',
        loadChildren: () => import('./pages/zone-list/zone-list.module').then(m => m.ZoneListPageModule)
    },
    {
        path: 'curiosities',
        loadChildren: () => import('./pages/curiosities/curiosities.module').then(m => m.CuriositiesPageModule)
    },
    {
        path: 'addresses',
        loadChildren: () => import('./pages/addresses/addresses.module').then(m => m.AddressesPageModule)
    },
    {
        path: 'complaint-history',
        loadChildren: () => import('./pages/complaint-history/complaint-history.module').then(m => m.ComplaintHistoryPageModule)
    },
    {
        path: 'complaint-details',
        loadChildren: () => import('./pages/complaint-details/complaint-details.module').then(m => m.ComplaintDetailsPageModule)
    },
    {
        path: 'recyclables',
        loadChildren: () => import('./pages/recyclables/recyclables.module').then(m => m.RecyclablesPageModule)
    },
  {
    path: 'platform-details',
    loadChildren: () => import('./platform-details/platform-details.module').then( m => m.PlatformDetailsPageModule)
  },
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }

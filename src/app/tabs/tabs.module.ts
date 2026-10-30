import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TranslatePipe } from '@ngx-translate/core';
import { TabsPage } from './tabs.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        TranslatePipe
    ],
    declarations: [TabsPage]
})
export class TabsPageModule { }

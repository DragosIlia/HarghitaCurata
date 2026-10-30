import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { NetworkPageRoutingModule } from './network-routing.module';
import { NetworkPage } from './network.page';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NetworkPageRoutingModule,
        HttpClientModule,
        TranslatePipe
    ],
    declarations: [NetworkPage]
})
export class NetworkPageModule { }

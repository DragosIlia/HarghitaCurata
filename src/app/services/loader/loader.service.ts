/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular/lazy';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    public currentLoader = null;
    constructor(private loadingController: LoadingController) { }

    async showLoader() {
        if (this.currentLoader !== null) return;
        this.currentLoader = await this.loadingController.create();
        await this.currentLoader.present();
    }

    hideLoader() {
        if (this.currentLoader === null) return;
        this.currentLoader.dismiss();
        this.currentLoader = null;
    }
}

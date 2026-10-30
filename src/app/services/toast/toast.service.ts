/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/lazy';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    public currentToast: HTMLIonToastElement = null;
    constructor(private toastController: ToastController) { }

    async showToast(message: string, icon: string, duration: number, position: 'top' | 'middle' | 'bottom', color: string = 'success') {
        if(this.currentToast !== null) this.currentToast.dismiss();
        this.currentToast = await this.toastController.create({ message, duration, icon, position, color, mode: 'ios' });
        await this.currentToast.present();
    }
}

import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/lazy';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
  constructor(private modalCtrl: ModalController) {}

  async openModal(componentRef: any, data: any = null) {
    const modal = await this.modalCtrl.create({
      component: componentRef,
      componentProps: { data },
    });

    await modal.present();
    return modal;
  }

  async closeModal(data: any = null) {
    await this.modalCtrl.dismiss(data, 'cancel');
  }
}

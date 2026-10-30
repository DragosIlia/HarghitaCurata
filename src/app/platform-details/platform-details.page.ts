import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular/lazy';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
  selector: 'app-platform-details',
  templateUrl: './platform-details.page.html',
  styleUrls: ['./platform-details.page.scss'],
})
export class PlatformDetailsPage implements OnInit {
  platformName: string = '';
  fractions: {
    name: string;
    volume: number;
    capacity: number;
    percentage: number;
    temperature: number;
    battery: number;
    color: string;
  }[] = [];

  constructor(private navParams: NavParams, private modalCtrl: ModalController) {}

  ngOnInit() {
    const data = this.navParams.get('data');
    if (!data?.platformsModule) return;

    this.platformName = data.name || '';

    this.fractions = data.platformsModule.map(mod => {
      const fraction = JSON.parse(mod.fractionType);
      const percentage = mod.volume;

      return {
        name: fraction.name,
        volume: mod.volume,
        capacity: mod.capacity,
        percentage,
        temperature: mod.temperature,
        battery: mod.battery,
        color: this.getColor(fraction.name)
      };
    });
  }

  getColor(fractionName: string): string {
    switch (fractionName.toLowerCase()) {
      case 'plastic-metal':
        return 'rgba(253, 216, 53, 0.8)'; // galben
      case 'rezidual':
        return 'rgba(158, 158, 158, 0.8)'; // gri
      case 'sticla':
        return 'rgba(56, 142, 60, 0.8)'; // verde închis
      case 'hartie':
        return 'rgba(66, 165, 245, 0.8)'; // albastru
      case 'biodegradabil':
        return 'rgba(141, 110, 99, 0.8)'; // maro
      default:
        return 'rgba(0, 0, 0, 0.8)'; // fallback negru
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
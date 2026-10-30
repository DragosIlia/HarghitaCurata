import { AppLauncher } from '@capacitor/app-launcher';
import { Capacitor } from '@capacitor/core';
import { LaunchNavigator } from '@capgo/capacitor-launch-navigator';

export async function openNavigation(latitude: number, longitude: number): Promise<void> {
    const destination = `${latitude},${longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    if (Capacitor.isNativePlatform()) {
        try {
            await LaunchNavigator.navigate({ destination: [latitude, longitude] });
        } catch {
            await AppLauncher.openUrl({ url });
        }
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

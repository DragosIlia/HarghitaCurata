import { Capacitor } from '@capacitor/core';

// Android emulator reaches the development PC through 10.0.2.2.
// A physical device needs the PC's LAN address instead.
const localApiHost = Capacitor.getPlatform() === 'android' ? '10.0.2.2' : 'localhost';

export const environment = {
    production: false,
    appName: 'Harghita Curata',
    mapKey: 'AIzaSyA0Z_ZQYIW8C_dttzL6ndz0qH-nWdwU5L4',
    supportMail: 'bihorcurat@ecolectbihor.ro',
    apiUrl: `http://${localApiHost}:5001/api/`
};

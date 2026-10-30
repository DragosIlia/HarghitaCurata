/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="@capacitor/splash-screen" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'ro.harghitacurata.app',
    appName: 'Harghita Curata',
    webDir: 'www/browser',
    server: {
        cleartext: true
    },
    plugins: {
        PushNotifications: {
            presentationOptions: ['badge', 'sound', 'alert'],
        },
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: '#ffffff',
            androidSplashResourceName: 'splash',
            // androidScaleType: 'CENTER_CROP',
            showSpinner: false,
            // androidSpinnerStyle: 'large',
            // iosSpinnerStyle: 'small',
            // spinnerColor: '#999999',
            splashFullScreen: true,
            splashImmersive: true,
            // layoutName: 'launch_screen',
            // useDialog: true,
        },
        
    },
};

export default config;

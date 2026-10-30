import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
    providedIn: 'root'
})


export class StorageService {

    constructor() { }

    async setStorageKey(key: string, value) {
        await Preferences.set({ key, value });
    }
    async getStorageKey(key: string) {
        return await Preferences.get({ key });
    }
    async removeStorageKey(key: string) {
        await Preferences.remove({ key });
    }
}

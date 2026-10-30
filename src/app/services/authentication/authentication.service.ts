/* eslint-disable curly */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap, filter, take, catchError } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import { IUser } from 'src/app/interfaces/IUser';
import { ModalService } from '../modal/modal.service';
import { LoaderService } from '../loader/loader.service';
import { ToastService } from '../toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserDetailsService } from '../user-details/user-details.service';
import { ResetPage } from 'src/app/pages/reset/reset.page';

export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    currentAccessToken = null;
    currentUser: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

    constructor(private toastService: ToastService, private translateService: TranslateService, private http: HttpClient, private storageService: StorageService, private modalService: ModalService, private loaderService: LoaderService, private userDetailsService: UserDetailsService) {
        this.loadToken();
    }

    async loadToken() {
        const token = await this.getToken();
        if (token && token.value) {
            this.currentAccessToken = token.value;
            this.setProfile();
        } else {
            this.isAuthenticated.next(false);
        }
    }

    getToken() {
        return this.storageService.getStorageKey(TOKEN_KEY);
    }

    login(credentials) {
        return this.http.post<{ accessToken: string; refreshToken: string }>(environment.apiUrl + 'account/login', credentials).pipe(
            switchMap((tokens: { accessToken, refreshToken }) => {
                this.currentAccessToken = tokens.accessToken;
                const storeAccess = this.storageService.setStorageKey(TOKEN_KEY, tokens.accessToken);
                const storeRefresh = this.storageService.setStorageKey(REFRESH_TOKEN_KEY, tokens.refreshToken);
                return from(Promise.all([storeAccess, storeRefresh]));
            }),
            tap(_ => {
                this.setProfile();
            })
        );
    }

    getNewAccessToken() {
        const refreshToken = from(this.storageService.getStorageKey(REFRESH_TOKEN_KEY));
        return refreshToken.pipe(
            switchMap(token => {
                if(token && token.value) {
                    const httpOptions = {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token.value}`
                        })
                    };
                    return this.http.get(environment.apiUrl + 'account/refresh-token', httpOptions);
                } else return of(null);
            })
        );
    }

    storeAccessToken(accessToken) {
        this.currentAccessToken = accessToken;
        return from(this.storageService.setStorageKey(TOKEN_KEY, accessToken));
    }

    async register(credentials) {
        await this.loaderService.showLoader();
        return this.http.post(environment.apiUrl + 'account/register', credentials, { observe: 'response' }).subscribe(
            async (res: any) => {
                this.toastService.showToast(this.translateService.instant(res.body.message), 'checkmark-circle-outline', 2000, 'top', 'success');
                await this.modalService.closeModal();
                await this.loaderService.hideLoader();
            },
            async (err) => {
                console.log(err);
                this.toastService.showToast(this.translateService.instant(err.error), 'alert-circle-outline', 3000, 'top', 'danger');
                await this.loaderService.hideLoader();
            }
        );
    }

    async recovery(model) {
        await this.loaderService.showLoader();
        return this.http.post(environment.apiUrl + 'account/recovery', model).subscribe(
            async (res: any) => {
                await this.loaderService.hideLoader();
                const resetPasswordRef = await this.modalService.openModal(ResetPage);
                resetPasswordRef.onDidDismiss().then(async (dataDismissed) => {
                    if(dataDismissed.data) {
                        await this.modalService.closeModal();
                    }
                });
            },
            async (err) => {
                console.log(err);
                await this.loaderService.hideLoader();
            }
        );
    }

    async reset(model) {
        await this.loaderService.showLoader();
        return this.http.post(environment.apiUrl + 'account/reset', model).subscribe(
            async (res: any) => {
                this.toastService.showToast(this.translateService.instant('Reset.Success'), 'checkmark-circle-outline', 2000, 'top', 'success');
                await this.modalService.closeModal(res);
                await this.loaderService.hideLoader();
            },
            async (err) => {
                console.log(err);
                this.toastService.showToast(this.translateService.instant(err.error), 'alert-circle-outline', 3000, 'top', 'danger');
                await this.loaderService.hideLoader();
            }
        );
    }

    async deleteAccount(model) {
        await this.loaderService.showLoader();
        return this.http.post(environment.apiUrl + 'account/delete', model).subscribe({
            next: (res: any) => {
                if(res.message) this.toastService.showToast(this.translateService.instant(res.message), 'checkmark-circle-outline', 2000, 'top', 'success');
                this.logout();
                this.loaderService.hideLoader();
            },
            error: (err) => {
                console.log(err);
                this.toastService.showToast(this.translateService.instant(err.error), 'alert-circle-outline', 3000, 'top', 'danger');
                this.loaderService.hideLoader();
            }
        });
    }

    setProfile() {
        this.getProfile().subscribe((data: IUser) => {
            this.currentUser.next(data);
            this.isAuthenticated.next(true);
        });
    }

    getUserDetails() {
        return this.currentUser;
    }

    getProfile() {
        return this.http.get<IUser>(environment.apiUrl + 'account/get-profile');
    }

    logout() {
        this.isAuthenticated.next(false);
        this.currentAccessToken = null;
        this.currentUser.next(null);
        this.userDetailsService.resetAddresses();
        this.storageService.removeStorageKey(TOKEN_KEY);
        this.storageService.removeStorageKey(REFRESH_TOKEN_KEY);
    }

    isLogged() {
        return this.isAuthenticated;
    }
}

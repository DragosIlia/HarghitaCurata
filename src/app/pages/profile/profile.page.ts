/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LoginPage } from '../login/login.page';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ModalService } from '../../services/modal/modal.service';
import { ISettings, Settings } from '../../interfaces/ISettings';
import { LanguageService } from '../../services/language/language.service';
import { LanguagePage } from '../language/language.page';
import { SupportPage } from '../support/support.page';
import { TermsPage } from '../terms/terms.page';
import { PrivacyPage } from '../privacy/privacy.page';
import { AccountDetailsPage } from '../account-details/account-details.page';
import { RequestTruckPage } from '../request-truck/request-truck.page';
import { SendMessagePage } from '../send-message/send-message.page';
import { FeedbackPage } from '../feedback/feedback.page';
import { Share } from '@capacitor/share';
import { IUser } from '../../interfaces/IUser';
import { FaqPage } from '../faq/faq.page';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { UpdateService } from '../../services/update/update.service';
import { UserDetailsService } from '../../services/user-details/user-details.service';
import { ToastService } from '../../services/toast/toast.service';
import { Dialog } from '@capacitor/dialog';
import { StorageService } from '../../services/storage/storage.service';
import { CuriositiesPage } from '../curiosities/curiosities.page';
import { AddressesPage } from '../addresses/addresses.page';

export const CURIOSITIES_KEY = 'curiosities-seen';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss']
})
export class ProfilePage {
    public mainLanguage: string = null;
    public isLogged: boolean;
    public userDetails: IUser = null;
    public appVersion = 'Unknown Version';
    public appVersionCode: string | number = null;
    public SettingsType = Settings;
    public settingsActions: ISettings = {
        'Tabs.Profile.Actions.Dividers.Account': [
            { name: 'Tabs.Profile.Actions.Details', type: this.SettingsType.Details, auth: true, canSeeWithoutAuth: false },
            { name: 'Tabs.Profile.Actions.Addresses', type: this.SettingsType.Addresses, auth: true, canSeeWithoutAuth: false },
            { name: 'Tabs.Profile.Actions.Truck', type: this.SettingsType.RequestTruck, auth: true, canSeeWithoutAuth: true },
            { name: 'Tabs.Profile.Actions.Message', type: this.SettingsType.SendMessage, auth: true, canSeeWithoutAuth: true },
            { name: 'Tabs.Profile.Actions.Language', type: this.SettingsType.Language, auth: false, canSeeWithoutAuth: true },
            { name: 'Tabs.Profile.Actions.Delete', type: this.SettingsType.Delete, auth: true, canSeeWithoutAuth: false },
        ],
        'Tabs.Profile.Actions.Dividers.ForYou': [
            { name: 'Tabs.Profile.Actions.Support', type: this.SettingsType.Support, auth: false, canSeeWithoutAuth: true },
            { name: 'Tabs.Profile.Actions.Feedback', type: this.SettingsType.Feedback, auth: false, canSeeWithoutAuth: true },
        ],
        'Tabs.Profile.Actions.Dividers.Information': [
            { name: 'Tabs.Profile.Actions.Curiosities', type: this.SettingsType.Curiosities, auth: false, canSeeWithoutAuth: true },
            { name: 'Tabs.Profile.Actions.FAQ', type: this.SettingsType.FAQ, auth: false, canSeeWithoutAuth: true },
            { name: 'Tabs.Profile.Actions.Terms', type: this.SettingsType.Terms, auth: false, canSeeWithoutAuth: true },
            { name: 'Tabs.Profile.Actions.Privacy', type: this.SettingsType.Privacy, auth: false, canSeeWithoutAuth: true },
        ],
    };
    public hasCuriositiesSeen: boolean = false;

    constructor(private storageService: StorageService, private authService: AuthenticationService, private loaderService: LoaderService, private modalService: ModalService, private languageService: LanguageService, private translateService: TranslateService, private updateService: UpdateService, private userDetailsService: UserDetailsService, private toastService: ToastService) {
        this.checkAuth();
        this.getMainLanguage();
        this.checkVersion();
        this.checkCuriositiesSeen();
    }

    checkVersion() {
        this.appVersion = this.updateService.getAppVersion();
        this.appVersionCode = this.updateService.getAppVersionCode();
    }

    getMainLanguage() {
        this.languageService.getLanguage().subscribe(lang => {
            this.mainLanguage = lang;
        });
    }


    checkAuth() {
        this.authService.isLogged().subscribe(x => {
            this.isLogged = x;
            if (this.isLogged)
                this.getUserDetails();
        });
    }

    getUserDetails() {
        this.authService.getUserDetails().subscribe(userDetails => {
            this.userDetails = userDetails;
        });
    }

    async checkCuriositiesSeen() {
        const hasCuriositiesSeen = await this.storageService.getStorageKey(CURIOSITIES_KEY);
        this.hasCuriositiesSeen = hasCuriositiesSeen && hasCuriositiesSeen.value === 'true';
    }

    async share() {
        const availability = await Share.canShare();
        if (!availability.value) return;
        await Share.share({
            title: environment.appName,
            text: `${environment.appName}: ${this.translateService.instant('Tabs.Profile.Share.Text')}`,
            dialogTitle: this.translateService.instant('Tabs.Profile.Share.Title'),
        });
    }

    async sendAction(type: Settings) {
        switch (type) {
            case Settings.Details: {
                if(!this.isLogged) {
                    this.toastService.showToast(this.translateService.instant('Tabs.Profile.Actions.NeedToBeLogged'), 'alert-circle-outline', 3000, 'top', 'danger');
                    return;
                }
                this.openModal(AccountDetailsPage, this.userDetails);
                break;
            }
            case Settings.Addresses: {
                if(!this.isLogged) {
                    this.toastService.showToast(this.translateService.instant('Tabs.Profile.Actions.NeedToBeLogged'), 'alert-circle-outline', 3000, 'top', 'danger');
                    return;
                }
                this.openModal(AddressesPage);
                break;
            }
            case Settings.RequestTruck: {
                if(!this.isLogged) {
                    this.toastService.showToast(this.translateService.instant('Tabs.Profile.Actions.NeedToBeLogged'), 'alert-circle-outline', 3000, 'top', 'danger');
                    return;
                }
                const hasAddresses = await this.checkIfUserHasAddresses();
                if (!hasAddresses) {
                    this.toastService.showToast(this.translateService.instant('Tabs.Profile.Actions.NeedAddress'), 'warning-outline', 2500, 'top', 'warning');
                    return;
                }
                this.openModal(RequestTruckPage, this.userDetails);
                break;
            }
            case Settings.SendMessage: {
                if(!this.isLogged) {
                    this.toastService.showToast(this.translateService.instant('Tabs.Profile.Actions.NeedToBeLogged'), 'alert-circle-outline', 3000, 'top', 'danger');
                    return;
                }
                const hasAddresses = await this.checkIfUserHasAddresses();
                if (!hasAddresses) {
                    this.toastService.showToast(this.translateService.instant('Tabs.Profile.Actions.NeedAddress'), 'warning-outline', 2500, 'top', 'warning');
                    return;
                }
                this.openModal(SendMessagePage, this.userDetails);
                break;
            }
            case Settings.Language: {
                this.openModal(LanguagePage);
                break;
            }
            case Settings.Support: {
                window.open('mailto:' + environment.supportMail);
                break;
            }
            case Settings.Terms: {
                this.openModal(TermsPage);
                break;
            }
            case Settings.Privacy: {
                this.openModal(PrivacyPage);
                break;
            }
            case Settings.Feedback: {
                this.openModal(FeedbackPage);
                break;
            }
            case Settings.FAQ: {
                this.openModal(FaqPage);
                break;
            }
            case Settings.Logout: {
                this.logout();
                break;
            }
            case Settings.Delete: {
                this.promptDeleteConfirmation();
                break;
            }
            case Settings.Curiosities: {
                if(!this.hasCuriositiesSeen) {
                    this.hasCuriositiesSeen = true;
                    await this.storageService.setStorageKey(CURIOSITIES_KEY, 'true');
                }

                this.openModal(CuriositiesPage, this.mainLanguage);
                break;
            }
            default: break;
        }
    }

    async promptDeleteConfirmation() {
        const { value } = await Dialog.confirm({
            title: this.translateService.instant('Tabs.Profile.Actions.PromptDelete.Title'),
            message: this.translateService.instant('Tabs.Profile.Actions.PromptDelete.Message'),
            okButtonTitle: this.translateService.instant('Tabs.Profile.Actions.PromptDelete.Ok'),
            cancelButtonTitle: this.translateService.instant('Tabs.Profile.Actions.PromptDelete.Cancel'),
        });

        if(!value) return;

        this.deleteAccount();
    }

    deleteAccount() {
        this.authService.deleteAccount(this.userDetails);
    }

    async checkIfUserHasAddresses() {
        const addresses = await this.userDetailsService.getAllAddresses();
        return addresses && addresses.length > 0;
    }

    async openModal(componentRef, data = null) {
        if (componentRef === null) return;
        const dialogRef = await this.modalService.openModal(componentRef, data);
        if (componentRef === AccountDetailsPage) {
            dialogRef.onDidDismiss().then((dataDismissed) => {
                if (dataDismissed.data)
                    this.authService.currentUser.next(dataDismissed.data);
            });
        }
    }

    getApplicationVersion() {
        return this.appVersion !== null ? `${this.appVersion} (${this.appVersionCode})` : 'Tabs.Profile.UnknownVersion';
    }

    sendToLogin() {
        this.openModal(LoginPage);
    }

    async logout() {
        await this.loaderService.showLoader();
        await this.authService.logout();
        await this.loaderService.hideLoader();
    }
}

/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable curly */
/* eslint-disable max-len */
import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICity } from 'src/app/interfaces/ICity';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UserDetailsService } from 'src/app/services/user-details/user-details.service';
import { StreetService } from '../../services/street/street.service';
import { IStreet } from '../../interfaces/IStreet';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { CityListPage } from '../city-list/city-list.page';
import { StreetListPage } from '../street-list/street-list.page';

export interface ISelectedCity {
    cityId: number;
    street: string;
    streetId: number;
}


@Component({
    changeDetection: ChangeDetectionStrategy.Default,


    standalone: false,
    selector: 'app-add-address',
    templateUrl: './add-address.page.html',
    styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
    public addressForm: FormGroup;

    public selectedCityName: string = null;
    public selectedCity: number = -1;

    public currentStreets: IStreet[] = undefined;
    public selectedStreet: string = null;
    public selectedStreetId: number = -1;

    public liveInBlock: boolean = false;

    constructor(private formBuilder: FormBuilder, private streetService: StreetService, private userService: UserDetailsService, private modalService: ModalService, private loaderService: LoaderService, private toastService: ToastService, private translateService: TranslateService) { }

    ngOnInit() {
        this.initValidators();
    }

    initValidators() {
        this.addressForm = this.formBuilder.group({
            city: [],
            street: [''],
            streetId: [''],
            streetNumber: ['', [Validators.maxLength(10)]],
            liveInBlock: [],
        });
    }

    tryOpenStreets() {
        if (this.selectedCity === -1 || !this.currentStreets) {
            this.toastService.showToast(this.translateService.instant('Address.NeedSelectCity'), 'warning-outline', 2500, 'top', 'warning');
            return;
        }

        if (this.currentStreets && this.currentStreets.length <= 0) {
            this.toastService.showToast(this.translateService.instant('Address.NoValidStreets'), 'warning-outline', 2500, 'top', 'warning');
            return;
        }

        this.openStreetList();
    }

    changeTypeOfLiving(e) {
        this.liveInBlock = e.currentTarget.checked;
    }

    async addAddress() {
        if (this.selectedCity === -1 || !this.addressForm.valid || (this.currentStreets && this.currentStreets.length > 0 && !this.selectedStreet)) return;

        const addressValues = this.addressForm.value;
        addressValues.city = this.selectedCity;
        addressValues.street = this.selectedStreet;
        addressValues.streetId = this.selectedStreetId;
        addressValues.liveInBlock = this.liveInBlock;
        await this.loaderService.showLoader();
        this.userService.addAddress(addressValues).subscribe(async (x) => {
            await this.modalService.closeModal(x);
            await this.loaderService.hideLoader();
        });
    }

    async openStreetList() {
        const selectedModel: ISelectedCity = {
            cityId: this.selectedCity,
            street: this.selectedStreet,
            streetId: this.selectedStreetId
        };

        const dialogRef = await this.modalService.openModal(StreetListPage, selectedModel);
        dialogRef.onDidDismiss().then((dataDismissed) => {
            if (dataDismissed.data && dataDismissed.role !== 'cancel') {
                const streetData = dataDismissed.data as IStreet;

                if(this.selectedStreet && this.selectedStreet === streetData.name) {
                    this.selectedStreet = null;
                    this.selectedStreetId = -1;
                }
                else {
                    this.selectedStreet = streetData.name;
                    this.selectedStreetId = streetData.id;
                }
            }
        });
    }

    async openCityList() {
        const dialogRef = await this.modalService.openModal(CityListPage, this.selectedCity);
        dialogRef.onDidDismiss().then((dataDismissed) => {
            if (dataDismissed.data && dataDismissed.role !== 'cancel') {
                const cityData = dataDismissed.data as ICity;
                this.selectedStreet = null;
                this.selectedStreetId = -1;

                if(this.selectedCity !== -1 && this.selectedCity === cityData.id) {
                    this.selectedCityName = null;
                    this.selectedCity = -1;
                    this.currentStreets = undefined;
                }
                else {
                    this.selectedCityName = cityData.fullName;
                    this.selectedCity = cityData.id;

                    this.streetService.getStreetsByCity(this.selectedCity, 1, 5).subscribe({
                        next: response => {
                            if (response.result && response.pagination) {
                                this.currentStreets = response.result;

                                if (this.currentStreets && this.currentStreets.length <= 0) {
                                    this.toastService.showToast(this.translateService.instant('Address.NoAddressesOnCity'), 'warning-outline', 2500, 'top', 'warning');
                                    const fullName = cityData.fullName;
                                    if (cityData.subCity) {
                                        const splitted = fullName.split(' ');
                                        const city = splitted[splitted.length - 1];
                                        this.selectedStreet = city.replace(/^\((.+)\)$/, '$1');
                                    } else this.selectedStreet = fullName;
                                    this.selectedStreetId = -1;
                                }
                            }
                        },
                        error: error => {
                            console.log('Error from add-address.component: ', error);
                        }
                    });
                }
            }
        });
    }
}

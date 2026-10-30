/* eslint-disable max-len */
/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { IAddress } from 'src/app/interfaces/IAddress';
import { Dialog } from '@capacitor/dialog';
import { UserDetailsService } from '../../services/user-details/user-details.service';
import { LoaderService } from '../../services/loader/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast/toast.service';
import { ModalService } from '../../services/modal/modal.service';
import { AddAddressPage } from '../add-address/add-address.page';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-addresses',
    templateUrl: './addresses.page.html',
    styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {
    public addresses: IAddress[] = [];

    constructor(private toastService: ToastService, private modalService: ModalService ,private userDetailsService: UserDetailsService, private loaderService: LoaderService, private translateService: TranslateService) { }

    ngOnInit() {
        this.getAddresses();
    }

    getAddresses() {
        this.addresses = this.userDetailsService.getAllAddresses();
    }

    sortBy(prop: string) {
        return this.addresses.sort((item1, item2) => (item1[prop] === item2[prop] ? 0 : (item1[prop] ? -1 : 1)));
    }

    async setActiveAddress(address: IAddress) {
        if (address === null) return;
        await this.loaderService.showLoader();
        this.userDetailsService.setActiveAddress(address).subscribe((res) => {
            this.addresses.forEach(x => x.main = false);
            address.main = true;
            this.userDetailsService.setMainAddress(address);
            this.loaderService.hideLoader();
        });
    }

    async promptDeleteAddress(address: IAddress) {
        if (address === null) return;

        const { value } = await Dialog.confirm({
            title: this.translateService.instant('Addresses.DeleteTitle'),
            message: this.translateService.instant('Addresses.DeleteConfirm'),
            okButtonTitle: this.translateService.instant('Addresses.DeleteOk'),
            cancelButtonTitle: this.translateService.instant('Addresses.DeleteCancel'),
        });

        if(!value) return;

        this.deleteAddress(address);
    }

    async deleteAddress(address: IAddress) {
        if (address === null) return;

        if (address.main) {
            this.toastService.showToast(this.translateService.instant('Addresses.CanNotDeleteMain'), 'alert-circle-outline', 3000, 'top', 'danger');
            return;
        }

        await this.loaderService.showLoader();
        this.userDetailsService.deleteAddress(address.id).subscribe(async (res) => {
            this.addresses = this.addresses.filter(x => x.id !== address.id);
            this.userDetailsService.setAddresses(this.addresses);
            this.toastService.showToast(this.translateService.instant('Addresses.Delete'), 'checkmark-circle-outline', 2000, 'top', 'success');
            await this.loaderService.hideLoader();
        });
    }

    async addNewAddress() {
        const dialogRef = await this.modalService.openModal(AddAddressPage);
        dialogRef.onDidDismiss().then((data) => {
            if (data.data) {
                this.toastService.showToast(this.translateService.instant('Addresses.Success'), 'checkmark-circle-outline', 2000, 'top', 'success');
                this.addresses.forEach(x => x.main = false);
                this.addresses.push(data.data);
                this.userDetailsService.setAddresses(this.addresses);
                this.userDetailsService.setMainAddress(data.data);
            }
        });
    }


}

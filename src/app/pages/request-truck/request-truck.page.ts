/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable curly */
/* eslint-disable max-len */
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { IUser } from 'src/app/interfaces/IUser';
import { TruckRequestService } from '../../services/truck-request/truck-request.service';
import { IAddress } from 'src/app/interfaces/IAddress';
import { UserDetailsService } from '../../services/user-details/user-details.service';
import { LanguageService } from '../../services/language/language.service';
import { Subscription } from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-request-truck',
    templateUrl: './request-truck.page.html',
    styleUrls: ['./request-truck.page.scss'],
})
export class RequestTruckPage implements OnInit, OnDestroy {
    public data: IUser;
    public userAddresses: IAddress[] = [];
    public selectedAddress: IAddress | null = null;
    public currentLanguage: string = null;
    public requestSubscription: Subscription = null;
    public languageSubscription: Subscription = null;
    public loadingPreview: boolean = false;
    public previewPdfSrc: string | null | undefined = undefined;
    public previewPdfZoom: number = 1;

    constructor(private requestService: TruckRequestService, private userDetailsService: UserDetailsService, private languageService: LanguageService) { }

    ngOnInit() {
        this.getMainLanguage();
    }

    ngOnDestroy() {
        this.resetRequest();
    }

    resetRequest() {
        console.log('Destroyed request truck modal page...');
        if(this.requestSubscription) {
            this.requestSubscription.unsubscribe();
            this.requestSubscription = null;
        }
        if(this.languageSubscription) {
            this.languageSubscription.unsubscribe();
            this.languageSubscription = null;
        }
        this.userAddresses = [];
    }

    getMainLanguage() {
        this.languageSubscription = this.languageService.getLanguage().subscribe(language => {
            this.currentLanguage = language;
            this.getAddresses();
        });
    }

    getAddresses() {
        const addresses = this.userDetailsService.getAllAddresses();
        this.userAddresses = addresses;
        if(this.userAddresses && this.userAddresses.length === 1) {
            this.selectedAddress = this.userAddresses[0];
            this.getPreviewFile();
        }
    }

    handleChange(e) {
        const addressId = e.detail.value;
        const findAddress = this.userAddresses.find(x => x.id === addressId);
        if(!findAddress) return;

        if(this.selectedAddress && this.selectedAddress.id === findAddress.id) return;

        this.selectedAddress = findAddress;
        this.getPreviewFile();
    }

    getPreviewFile() {
        if(!this.selectedAddress) return;

        const model: any = { id: this.selectedAddress.id, language: this.currentLanguage };
        this.loadingPreview = true;

        setTimeout(() => {
            this.requestSubscription = this.requestService.getFileFromAddress(model).subscribe({
                next: (res) => {
                    const url = window.URL.createObjectURL(res);
                    this.previewPdfZoom = 0.5;
                    this.previewPdfSrc = url;
                    this.loadingPreview = false;
                },
                error: (err) => {
                    console.log(err);
                    this.previewPdfZoom = 1;
                    this.previewPdfSrc = null;
                    this.loadingPreview = false;
                }
            });
        }, 500);
    }

    editPdfZoom(mode: string) {
        if(!this.previewPdfSrc) return;

        switch(mode) {
            case 'in':
                if(this.previewPdfZoom >= 2) {
                    this.previewPdfZoom = 2;
                    return;
                }
                this.previewPdfZoom += 0.1;
                break;
            case 'out':
                if(this.previewPdfZoom < 0.2) {
                    this.previewPdfZoom = 0.1;
                    return;
                }
                this.previewPdfZoom -= 0.1;
                break;
            default: break;
        }
    }
}

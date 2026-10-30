/* eslint-disable curly */
/* eslint-disable max-len */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal/modal.service';
import { LoaderService } from '../../services/loader/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast/toast.service';
import { FeedbackService } from '../../services/feedback/feedback.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-feedback',
    templateUrl: './feedback.page.html',
    styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
    public feedbackForm: FormGroup;
    public experienceStars: boolean[] = [false, false, false, false, false];

    constructor(private formBuilder: FormBuilder, private modalService: ModalService, private loaderService: LoaderService, private translateService: TranslateService, private toastService: ToastService, private feedbackService: FeedbackService) { }

    ngOnInit() {
        this.initValidators();
    }

    initValidators() {
        this.feedbackForm = this.formBuilder.group({
            message: ['', [Validators.required]],
            ratingStars: [],
        });
    }

    async sendFeedback() {
        if(this.getRatingStars() <= 0) {
            this.toastService.showToast(this.translateService.instant('Feedback.RatingRequired'), 'alert-circle-outline', 3000, 'top', 'danger');
            return;
        }
        const feedBackFormValues = this.feedbackForm.value;
        feedBackFormValues.ratingStars = this.getRatingStars();
        await this.loaderService.showLoader();
        this.feedbackService.sendFeedback(feedBackFormValues).subscribe(async (x) => {
            await this.modalService.closeModal();
            this.toastService.showToast(this.translateService.instant('Feedback.Success'), 'checkmark-circle-outline', 2000, 'top', 'success');
            await this.loaderService.hideLoader();
        });

    }

    getRatingStars() {
        return this.experienceStars.filter(x=> x).length;
    }

    markRating(indexOfStar: number) {
        const findArray = this.experienceStars.filter((element, index) => index <= indexOfStar);
        this.experienceStars.fill(false);
        for(let i = 0; i < findArray.length; i ++) this.experienceStars[i] = true;
    }

}

/* eslint-disable curly */
import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FaqService } from '../../services/faq/faq.service';
import { IQuestion } from '../../interfaces/IQuestion';
import { Subscription } from 'rxjs';
import { IonAccordionGroup } from '@ionic/angular/lazy';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-faq',
    templateUrl: './faq.page.html',
    styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit, OnDestroy {
    @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;
    public questions: IQuestion[] = null;
    public questionSubscribe: Subscription = null;
    constructor(private faqService: FaqService) { }

    ngOnInit() {
        this.getQuestions();
    }

    ngOnDestroy() {
        this.destroySubscribe();
    }

    destroySubscribe() {
        if (this.questionSubscribe !== null) {
            this.questionSubscribe.unsubscribe();
            this.questionSubscribe = null;
        }
        this.questions = null;
    }

    getQuestions() {
        this.questionSubscribe = this.faqService.getQuestions().subscribe((questions) => {
            this.questions = questions;
            this.openFirstQuestion();
        });
    }

    openFirstQuestion() {
        if (!this.questions || this.questions.length === 0) return;

        this.accordionGroup.value = this.questions[0].id.toString();
    }

}

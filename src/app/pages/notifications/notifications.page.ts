/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable curly */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable max-len */
import { DatePipe, KeyValue } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { INotification, NotificationType } from 'src/app/interfaces/INotification';
import { LanguageService } from '../../services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { INotificationData } from '../../interfaces/INotification';
import { NotificationService } from '../../services/notification/notification.service';
import { Subscription } from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,

    standalone: false,
    selector: 'app-notifications',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit, OnDestroy {
    public notifications: INotificationData[] = null;
    public sortedNotifications: INotification = null;
    public notificationsSubscribe: Subscription = null;

    public currentLocale: string = 'en';

    constructor(private translateService: TranslateService, private notificationService: NotificationService, private languageService: LanguageService) { }

    ngOnInit() {
        this.getLocale();
        this.getNotifications();
    }

    ngOnDestroy() {
        console.log('Destroyed notifications modal page...');
        this.resetNotifications();
    }

    getLocale() {
        this.languageService.getLocale().subscribe(res => {
            this.currentLocale = res;
        });
    }

    resetNotifications() {
        if(this.notificationsSubscribe) this.notificationsSubscribe.unsubscribe();
        this.notifications = null;
        this.sortedNotifications = null;
    }

    sort(o) {
        return Object.keys(o).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).reduce((a, k) => { a[k] = o[k]; return a; }, {});
    }

    keyDescOrder = (a, b): number => a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);

    getNotifications() {
        this.notificationsSubscribe = this.notificationService.getNotifications().subscribe((notifications: INotificationData[]) => {
            this.notifications = notifications;
            this.getSortedNotifications();
        });
    }

    getSortedNotifications() {
        const sortedNotifications: INotification = {};
        const datePipe = new DatePipe(this.currentLocale);
        this.notifications.forEach(notification => {
            const date = datePipe.transform(notification.date, 'MM/dd/yyyy');
            const hour = datePipe.transform(notification.date, 'HH:mm');
            if (!sortedNotifications[date]) sortedNotifications[date] = [];
            notification.time = hour;
            sortedNotifications[date].push(notification);
        });
        this.sortedNotifications = this.sort(sortedNotifications);
    }

    handleRefresh(event) {
        setTimeout(() => {
            event.target.complete();
            this.getNotifications();
        }, 2000);
    };

    isEmptyNotifications(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }

    isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toDateString() === date.toDateString();
    }

    isToday(date) {
        const now = new Date();
        return now.toDateString() === date.toDateString();
    }

    shortFormat(date) {
        const newDate = new Date(date);
        return newDate.toLocaleDateString(this.currentLocale, { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
    }

    formatDate(date: string): string {
        const notificationDate = new Date(date);
        if (this.isToday(notificationDate)) return `${this.translateService.instant('Notifications.Today')}, ${this.shortFormat(notificationDate)}`;
        else if (this.isYesterday(notificationDate)) return `${this.translateService.instant('Notifications.Yesterday')}, ${this.shortFormat(notificationDate)}`;
        return this.shortFormat(notificationDate);
    }

    getNotificationName(type: NotificationType): string {
        switch (type) {
            case NotificationType.Info: return 'information-circle-outline';
            case NotificationType.Success: return 'checkmark-circle-outline';
            case NotificationType.Danger: return 'alert-circle-outline';
            default: return 'help-circle-outline';
        }
    }

    getNotificationColor(type: NotificationType): string {
        switch (type) {
            case NotificationType.Info: return 'warning';
            case NotificationType.Success: return 'success';
            case NotificationType.Danger: return 'danger';
            default: return 'medium';
        }
    }

    getCardClass(type: NotificationType) {
        switch (type) {
            case NotificationType.Info: return 'info';
            case NotificationType.Success: return 'success';
            case NotificationType.Danger: return 'danger';
            default: break;
        }
    }

    calcDiff(notificationDate, time) {
        if (!this.isToday(new Date(notificationDate))) return time;

        const formattedDate = new Date(notificationDate + ' ' + time);
        const now = new Date();

        const diff = now.getTime() - formattedDate.getTime();
        const diffHrs = Math.floor((diff % 86400000) / 3600000);
        const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);

        if (diffHrs > 0) return `${diffHrs}h`;
        else if (diffMins > 1) return `${diffMins}m`;
        return this.translateService.instant('Notifications.Recently').toLowerCase();
    }
}

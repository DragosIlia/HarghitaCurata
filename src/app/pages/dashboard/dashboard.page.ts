/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable curly */
/* eslint-disable max-len */
import { registerLocaleData } from '@angular/common';
import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { CalendarDateFormatter, CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import { CustomDateFormatter } from 'src/app/helpers/custom-date-formatter.provider.ts';
import { IUser } from 'src/app/interfaces/IUser';
import { ICalendar, ICalendarEvent, ICalendarPeriod, ICalendarFractions } from '../../interfaces/ICalendar';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { CalendarService } from '../../services/calendar/calendar.service';
import { CitiesService } from '../../services/cities/cities.service';
import { UserDetailsService } from '../../services/user-details/user-details.service';
import { LanguageService } from '../../services/language/language.service';
import { ModalService } from '../../services/modal/modal.service';
import { ZoneListPage } from '../zone-list/zone-list.page';
import { IZone } from '../../interfaces/IZone';


@Component({
    changeDetection: ChangeDetectionStrategy.Default,


    standalone: false,
    selector: 'app-dashboard',
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.scss'],
    providers: [
        {
            provide: CalendarDateFormatter,
            useClass: CustomDateFormatter,
        },
    ],
})
export class DashboardPage {
    public isLogged = false;
    public userDetails: IUser = null;
    public locale: string = 'en';

    public view: CalendarView = CalendarView.Month;
    public currentDate: Date = new Date();
    public fractionEvents: CalendarEvent[] = [];
    public todayEvents: ICalendarEvent[] = [];
    public refresh = new Subject<void>();
    public selectedCalendar: ICalendar = undefined;
    public nextCollectEvents: CalendarEvent[] = [];
    public currentZoneId: number = -1;
    public currentZoneName: string = null;

    public loadingCalendar: boolean = false;

    constructor(private authService: AuthenticationService, private languageService: LanguageService, private calendarService: CalendarService, private userDetailsService: UserDetailsService, private modalService: ModalService) {
        this.getLocaleData();
        this.checkAuth();
    }

    getLocaleData() {
        this.languageService.getLocale().subscribe(res => {
            this.locale = res;
            this.refreshCalendar();
        });
    }

    checkAuth() {
        this.authService.isLogged().subscribe(logged => {
            this.isLogged = logged;
            if (this.isLogged)
                this.getUserDetails();
        });
    }

    getUserDetails() {
        this.authService.getUserDetails().subscribe(userDetails => {
            this.userDetails = userDetails;
            if (this.userDetails)
                this.getAddresses();
        });
    }

    getAddresses() {
        this.userDetailsService.getAddresses().subscribe(addresses => {
            if (addresses) {
                const findMainAddress = addresses.find(x => x.main);
                if (findMainAddress) this.userDetailsService.setMainAddress(findMainAddress);
                this.userDetailsService.setAddresses(addresses);
                this.getMainCalendar();
            }
        });
    }

    getMainCalendar() {
        this.userDetailsService.getMainAddress().subscribe(address => {
            if (address) {
                if(address.liveInBlock) this.getBlockCalendar();
                else this.getCalendar(address.zone);
            }
        });
    }

    async openZoneList() {
        if (this.loadingCalendar) return;

        const dialogRef = await this.modalService.openModal(ZoneListPage, this.currentZoneId);
        dialogRef.onDidDismiss().then((dataDismissed) => {
            if (dataDismissed.data && dataDismissed.role !== 'cancel') {
                const zoneSelected = dataDismissed.data as IZone;
                this.getCalendar(zoneSelected);
            }
        });
    }

    changeDay(event: any) {
        this.currentDate = event;
        this.todayEvents = [];
        this.getTodayEvents();
    }

    getCalendarBlockNameByLocale() {
        switch(this.locale) {
            case 'en': return 'UAT Blocks';
            case 'hu': return 'UAT Blokkok';
            default: return 'UAT Blocuri';
        }
    }

    getBlockCalendar() {
        this.previewLoadingCalendar();

        setTimeout(() => {
            this.calendarService.getBlockCalendar().subscribe({
                next: calendar => {
                    this.loadingCalendar = false;
                    if (calendar) {
                        this.currentZoneName = this.getCalendarBlockNameByLocale();
                        this.nextCollectEvents = [];
                        this.currentDate = new Date();
                        this.todayEvents = [];
                        this.selectedCalendar = calendar;
                        this.refreshCalendar();
                    }
                },
                error: error => {
                    this.loadingCalendar = false;
                    this.selectedCalendar = undefined;
                    console.log('Error from dashboard.component: ', error);
                }
            });
        }, 750);
    }

    getCalendar(zone: IZone) {
        this.previewLoadingCalendar();

        setTimeout(() => {
            this.calendarService.getCalendar(zone.id).subscribe({
                next: calendar => {
                    this.loadingCalendar = false;
                    if (calendar) {
                        this.currentZoneId = zone.id;
                        if (zone.city) {
                            if (zone.city.hasMoreThanOneZone) this.currentZoneName = `${zone.city.name} (${zone.zoneNumber})`;
                            else this.currentZoneName = zone.city.name;
                        }
                        this.nextCollectEvents = [];
                        this.currentDate = new Date();
                        this.todayEvents = [];
                        this.selectedCalendar = calendar;
                        this.refreshCalendar();
                    }
                },
                error: error => {
                    this.loadingCalendar = false;
                    this.selectedCalendar = undefined;
                    console.log('Error from dashboard.component: ', error);
                }
            });
        }, 750);
    }

    previewLoadingCalendar() {
        this.loadingCalendar = true;
        this.currentZoneId = -1;
        this.currentZoneName = null;
        this.selectedCalendar = undefined;
        this.nextCollectEvents = [];
        this.currentDate = new Date();
        this.todayEvents = [];
        this.fractionEvents = [];
        this.refresh.next();
    }

    refreshCalendar() {
        this.generateFractions();
        this.refresh.next();
    }

    getNextCollectionEvent() {
        const today = new Date();
        const finalEvents = this.fractionEvents.filter(x => x.start >= today);
        const sortedEvents = finalEvents.sort((a, b) => (a.start >= b.start) ? 1 : ((b.start >= a.start) ? -1 : 0));
        if (sortedEvents !== null && sortedEvents.length > 0) {
            const newCalendarEvents: CalendarEvent[] = [];
            let setDate: Date = null;
            sortedEvents.forEach(x=> {
                if(!setDate) {
                    setDate = x.start;
                    newCalendarEvents.push(x);
                }
                else {
                    if(setDate.getTime() === x.start.getTime()) {
                        newCalendarEvents.push(x);
                    }
                }
            });
            this.nextCollectEvents = newCalendarEvents;
        }
    }

    isNotTheSameDay(nextCollection: Date) {
        const nextCollectionDate = startOfDay(new Date(nextCollection));
        const currentDate = startOfDay(new Date(this.currentDate));
        return nextCollectionDate.getTime() !== currentDate.getTime();
    }

    getFractionNameByLocale(fraction: ICalendarFractions) {
        switch(this.locale) {
            case 'en': return fraction.fractionType.nameGb;
            case 'hu': return fraction.fractionType.nameHu;
            default: return fraction.fractionType.name;
        }
    }

    generateFractions() {
        this.fractionEvents = [];

        if (this.selectedCalendar === null || this.selectedCalendar === undefined || this.selectedCalendar.fractions.length <= 0) return;
        this.selectedCalendar.fractions.forEach(x => {
            let realStartDate = new Date(x.startDate);
            const realEndDate = new Date(x.endDate);
            switch (x.repeat) {
                //daily
                case 1: {
                    const frequency = 1;
                    while (realStartDate <= realEndDate) {
                        const event: CalendarEvent = {
                            id: x.id,
                            title: this.getFractionNameByLocale(x),
                            start: startOfDay(realStartDate),
                            color: { primary: x.fractionType.color, secondary: x.fractionType.color },
                            actions: null
                        };
                        if (event.start.getDay() === 1 || event.start.getDay() === 2 || event.start.getDay() === 3 ||
                            event.start.getDay() === 4 || event.start.getDay() === 5) {
                            this.fractionEvents.push(event);
                        }
                        if ((event.start.getDay() === 0 || event.start.getDay() === 6) && x.isWeekend) {
                            this.fractionEvents.push(event);
                        }

                        const newDate = realStartDate.setDate(realStartDate.getDate() + frequency);
                        realStartDate = new Date(newDate);
                    }
                    break;
                }
                //weekly
                case 2: {
                    const frequency = 1;
                    while (realStartDate <= realEndDate) {
                        const event: CalendarEvent = {
                            id: x.id,
                            title: this.getFractionNameByLocale(x),
                            start: startOfDay(realStartDate),
                            color: { primary: x.fractionType.color, secondary: x.fractionType.color },
                            actions: null
                        };
                        if (x.daysOfWeekMo === true && event.start.getDay() === 1) {
                            this.fractionEvents.push(event);
                        }
                        if (x.daysOfWeekTu === true && event.start.getDay() === 2) {
                            this.fractionEvents.push(event);
                        }
                        if (x.daysOfWeekWe === true && event.start.getDay() === 3) {
                            this.fractionEvents.push(event);
                        }
                        if (x.daysOfWeekTh === true && event.start.getDay() === 4) {
                            this.fractionEvents.push(event);
                        }
                        if (x.daysOfWeekFr === true && event.start.getDay() === 5) {
                            this.fractionEvents.push(event);
                        }
                        if (x.daysOfWeekSa === true && event.start.getDay() === 6) {
                            this.fractionEvents.push(event);
                        }
                        if (x.daysOfWeekSu === true && event.start.getDay() === 0) {
                            this.fractionEvents.push(event);
                        }

                        const newDate = realStartDate.setDate(realStartDate.getDate() + frequency);
                        realStartDate = new Date(newDate);
                    }
                    break;
                }
                //monthly
                case 3: {
                    let listOfDates: ICalendarPeriod[] = [];
                    realStartDate.setDate(1);
                    if (realEndDate.getMonth() === 0 || realEndDate.getMonth() === 2 || realEndDate.getMonth() === 4 ||
                        realEndDate.getMonth() === 6 || realEndDate.getMonth() === 7 || realEndDate.getMonth() === 9 ||
                        realEndDate.getMonth() === 11) {
                        realEndDate.setDate(31);
                    }
                    if (realEndDate.getMonth() === 3 || realEndDate.getMonth() === 5 || realEndDate.getMonth() === 8 ||
                        realEndDate.getMonth() === 10) {
                        realEndDate.setDate(30);
                    }
                    if (realEndDate.getMonth() === 1) {
                        realEndDate.setDate(28);
                    }
                    listOfDates = this.getDayWeekNumber(realStartDate, realEndDate);
                    listOfDates.forEach(y => {
                        const event: CalendarEvent = {
                            id: x.id,
                            title: this.getFractionNameByLocale(x),
                            start: startOfDay(y.date),
                            color: { primary: x.fractionType.color, secondary: x.fractionType.color }
                        };
                        if (x.selectedDay === y.date.getDay()) {
                            if (x.selectedWeek === y.week) { /// 24 Noiembrie - selected: 5, y.week = 4
                                this.fractionEvents.push(event);
                            } else {
                                if (y.week === 4 && x.selectedWeek === 5) {
                                    const currentDate = new Date(y.date);
                                    const nextDate = new Date(currentDate.setDate(currentDate.getDate() + 7));

                                    const findDay = listOfDates.find(x => x.date.getTime() === nextDate.getTime());
                                    if (findDay === undefined || (findDay !== undefined && findDay.week !== 5)) {
                                        this.fractionEvents.push(event);
                                    }
                                }
                            }
                        }
                    });
                    break;
                }
                case 4: {
                    if(x.frequency <= 0) break;
                    while (realStartDate <= realEndDate) {
                        const event: CalendarEvent = {
                            id: x.id,
                            title: this.getFractionNameByLocale(x),
                            start: startOfDay(realStartDate),
                            color: { primary: x.fractionType.color, secondary: x.fractionType.color },
                            actions: null
                        };
                        this.fractionEvents.push(event);
                        const newDate = realStartDate.setDate(realStartDate.getDate() + x.frequency);
                        realStartDate = new Date(newDate);
                    }
                    break;
                }
                default: break;
            }
        });
        this.getTodayEvents();
        this.getNextCollectionEvent();
    }

    getTodayEvents() {
        const todayEvents = this.fractionEvents.filter(x => x.start.getTime() === startOfDay(this.currentDate).getTime());
        this.todayEvents = [];
        this.generateTodayEvents(todayEvents);
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
        this.currentDate = date;
        this.todayEvents = [];
        this.generateTodayEvents(events);
    }

    generateTodayEvents(events: CalendarEvent[]) {
        if (events === null || events === undefined || events.length <= 0) return;

        events.forEach(event => {
            const newEvent: ICalendarEvent = {
                name: event.title,
                color: event.color.primary,
                date: event.start
            };
            this.todayEvents.push(newEvent);
        });
    }

    getDayWeekNumber(startDate: Date, endDate: Date) {
        const listOfDates: ICalendarPeriod[] = [];
        let currentMonth = -1;
        let currentWeek = 1;
        let count = 0;

        while (startDate <= endDate) {
            if (count === 7) {
                currentWeek++;
                count = 0;
            }

            currentMonth = startDate.getMonth();
            const copyOfCurrentDate: Date = new Date(startDate);

            const newPeriod: ICalendarPeriod = {
                date: copyOfCurrentDate,
                week: currentWeek
            };
            listOfDates.push(newPeriod);

            let verifyNextDay: Date = new Date(startDate);
            const newVerifyDate = verifyNextDay.setDate(verifyNextDay.getDate() + 1);
            verifyNextDay = new Date(newVerifyDate);

            const newDate = startDate.setDate(startDate.getDate() + 1);
            startDate = new Date(newDate);
            count++;

            if (verifyNextDay.getMonth() > currentMonth || verifyNextDay.getFullYear() > copyOfCurrentDate.getFullYear()) {
                currentMonth = verifyNextDay.getMonth();
                currentWeek = 1;
                count = 0;
            }
        }
        return listOfDates;
    }
}

/* eslint-disable curly */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ICalendar } from 'src/app/interfaces/ICalendar';
import { catchError, map } from 'rxjs/operators';
import { IZone } from '../../interfaces/IZone';
import { IPaginatedResult } from 'src/app/interfaces/IPaginated';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    public paginatedZonesResult: IPaginatedResult<IZone[]> = new IPaginatedResult<IZone[]>();

    constructor(private http: HttpClient) { }

    getCalendar(zoneId: number) {
        console.log('Getting calendar from API.');

        const modelZone: any = {
            ZoneId: zoneId,
            Type: 'mobile'
        };

        return this.http.post<ICalendar>(environment.apiUrl + 'calendar/get-calendar', modelZone).pipe(catchError(modelZone));
    }

    getBlockCalendar() {
        return this.http.get<ICalendar>(environment.apiUrl + 'calendar/get-block-calendar');
    }

    getCalendarZones(page?: number, itemsPerPage?: number, searchString?: string) {
        console.log('Getting calendar zones from API.');
        let params = new HttpParams();

        if(page && itemsPerPage){
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if(searchString) {
            params = params.append('searchString', searchString);
        }

        return this.http.get<IZone[]>(environment.apiUrl + 'calendar/get-mobile-zones', {observe: 'response', params}).pipe(
            map(response => {
                if(response.body) this.paginatedZonesResult.result = response.body;

                const pagination = response.headers.get('Pagination');
                if(pagination)
                    this.paginatedZonesResult.pagination = JSON.parse(pagination);

                return this.paginatedZonesResult;
            })
        );
    }
}

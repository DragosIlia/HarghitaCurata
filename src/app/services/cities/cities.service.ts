/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ICity } from '../../interfaces/ICity';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { IPaginatedResult } from 'src/app/interfaces/IPaginated';

@Injectable({
    providedIn: 'root'
})
export class CitiesService {
    public paginatedCitiesResult: IPaginatedResult<ICity[]> = new IPaginatedResult<ICity[]>();
    constructor(private http: HttpClient) { }

    getCities(page?: number, itemsPerPage?: number, searchString?: string) {
        console.log('Getting cities from API.');
        let params = new HttpParams();

        if(page && itemsPerPage){
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if(searchString) {
            params = params.append('searchString', searchString);
        }

        return this.http.get<ICity[]>(environment.apiUrl + 'cities/get', {observe: 'response', params}).pipe(
            map(response => {
                if(response.body) this.paginatedCitiesResult.result = response.body;

                const pagination = response.headers.get('Pagination');
                if(pagination)
                    this.paginatedCitiesResult.pagination = JSON.parse(pagination);

                return this.paginatedCitiesResult;
            })
        );
    }
}

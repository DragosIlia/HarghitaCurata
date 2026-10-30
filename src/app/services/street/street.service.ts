/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ICity } from '../../interfaces/ICity';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { IPaginatedResult } from 'src/app/interfaces/IPaginated';
import { IStreet } from 'src/app/interfaces/IStreet';

@Injectable({
    providedIn: 'root'
})
export class StreetService {

    public paginatedStreetResult: IPaginatedResult<IStreet[]> = new IPaginatedResult<IStreet[]>();
    constructor(private http: HttpClient) { }

    getStreetsByCity(cityId: number, page?: number, itemsPerPage?: number, searchString?: string) {
        console.log('Getting streets from API.');
        let params = new HttpParams();

        if(page && itemsPerPage){
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if(searchString) {
            params = params.append('searchString', searchString);
        }

        params = params.append('cityId', cityId);

        return this.http.get<IStreet[]>(environment.apiUrl + `street/get-by-city`, {observe: 'response', params}).pipe(
            map(response => {
                if(response.body) this.paginatedStreetResult.result = response.body;

                const pagination = response.headers.get('Pagination');
                if(pagination)
                    this.paginatedStreetResult.pagination = JSON.parse(pagination);

                return this.paginatedStreetResult;
            })
        );
    }
}

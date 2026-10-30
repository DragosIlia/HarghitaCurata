/* eslint-disable curly */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IPaginatedResult } from 'src/app/interfaces/IPaginated';
import { environment } from 'src/environments/environment';
import { ICuriosity } from '../../interfaces/ICuriosity';

@Injectable({
    providedIn: 'root'
})
export class CuriositiesService {
    public paginatedCuriositiesResult: IPaginatedResult<ICuriosity[]> = new IPaginatedResult<ICuriosity[]>();

    constructor(private http: HttpClient) { }

    getCuriosities(page?: number, itemsPerPage?: number) {
        console.log('Getting curiosities from API.');
        let params = new HttpParams();

        if(page && itemsPerPage){
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        return this.http.get<ICuriosity[]>(environment.apiUrl + 'curiosity/get', {observe: 'response', params}).pipe(
            map(response => {
                if(response.body) this.paginatedCuriositiesResult.result = response.body;

                const pagination = response.headers.get('Pagination');
                if(pagination)
                    this.paginatedCuriositiesResult.pagination = JSON.parse(pagination);

                return this.paginatedCuriositiesResult;
            })
        );
    }
}

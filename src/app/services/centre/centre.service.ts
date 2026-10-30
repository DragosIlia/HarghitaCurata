/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ICollectionCentre, ICollectionCentreFraction, ICollectionCentreItem } from 'src/app/interfaces/ICollectionCentre';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CentreService {
    public centres: ICollectionCentre[] = null;
    public fractionTypes: BehaviorSubject<ICollectionCentreFraction[]> = new BehaviorSubject<ICollectionCentreFraction[]>(null);

    public mapStyle = [{
        elementType: 'geometry',
        stylers: [
            {
                color: '#f5f5f5'
            }
        ]
    },
    {
        elementType: 'labels.icon',
        stylers: [
            {
                visibility: 'off'
            }
        ]
    },
    {
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#616161'
            }
        ]
    },
    {
        elementType: 'labels.text.stroke',
        stylers: [
            {
                color: '#f5f5f5'
            }
        ]
    },
    {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#bdbdbd'
            }
        ]
    },
    {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#f0f0f0'
            }
        ]
    },
    {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#fafafa'
            }
        ]
    },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
            {
                color: '#eeeeee'
            }
        ]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#757575'
            }
        ]
    },
    {
        featureType: 'poi.business',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#ffffff'
            }
        ]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
            {
                color: '#e5e5e5'
            }
        ]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#cfcfcf'
            }
        ]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#9e9e9e'
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
            {
                color: '#ffffff'
            }
        ]
    },
    {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#ffffff'
            }
        ]
    },
    {
        featureType: 'road.arterial',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#6e6e6e'
            }
        ]
    },
    {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#757575'
            }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
            {
                color: '#dadada'
            }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#fcfcfc'
            }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#808080'
            }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#616161'
            }
        ]
    },
    {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#cfcfcf'
            }
        ]
    },
    {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#fafafa'
            }
        ]
    },
    {
        featureType: 'road.local',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#a6a6a6'
            }
        ]
    },
    {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#9e9e9e'
            }
        ]
    },
    {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [
            {
                color: '#e5e5e5'
            }
        ]
    },
    {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [
            {
                color: '#eeeeee'
            }
        ]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
            {
                color: '#c9c9c9'
            }
        ]
    },
    {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#ffffff'
            }
        ]
    },
    {
        featureType: 'water',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#050505'
            }
        ]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#9e9e9e'
            }
        ]
    }
    ];
    constructor(private http: HttpClient) { }

    getCentres() {
        console.log('Getting centres from API.');
        return this.http.get<ICollectionCentre[]>(environment.apiUrl + 'centres/get');
    }

    getCentreItemsById(centreId: number) {
        console.log('Getting centre items from API.');
        return this.http.post<ICollectionCentreItem[]>(environment.apiUrl + 'centres/get-items-by-id', centreId);
    }

    getFractionTypes() {
        console.log('Getting fraction types from API.');
        return this.http.get<ICollectionCentreFraction[]>(environment.apiUrl + 'fraction/get');
    }

    setCentres(centres: ICollectionCentre[]) {
        this.centres = centres;
    }

    setFractions(fractions: ICollectionCentreFraction[]) {
        this.fractionTypes.next(fractions);
    }

    getFractions() {
        return this.fractionTypes;
    }

    receiveCentres() {
        return this.centres;
    }

    getMapStyle() {
        return this.mapStyle;
    }
}

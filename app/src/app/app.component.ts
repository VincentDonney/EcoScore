import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {GoogleMap, GoogleMapsModule} from "@angular/google-maps";
import {FormsModule} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {Restaurant} from "./Restaurant";
import {MarkerProperties} from "./MarkerProperties";


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, GoogleMapsModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    @ViewChild('myGoogleMap', { static: true }) map!: GoogleMap;
    isOrganic: boolean = false;
    isClimate: boolean = false;
    isWaterSavy: boolean = false;
    isSocial: boolean = false;
    isWaste: boolean = false;
    isGovernance: boolean = false;
    isAdverse: boolean = false;

    constructor(private http: HttpClient) {}

    markerClicked: boolean = false;
    selected: MarkerProperties = {
        position: {
            lat: 0,
            lng: 0
        },
        label: "",
        organicRate: 0,
        climateRate: 0,
        waterSavyRate: 0,
        socialRate: 0,
        governanceRate: 0,
        wasteRate: 0,
        adverseRate: 0,
        index: 0
    };
    gmap? : google.maps.Map;
    center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
    options: google.maps.MapOptions = {
        scrollwheel: true,
        disableDoubleClickZoom: true,
        mapTypeId: 'roadmap',
        maxZoom: 15,
        minZoom: 0
    };

    markers: MarkerProperties[] = [];
    addedMarkers: google.maps.Marker[] = [];
    filter: string = "";

    ngOnInit() {
        this.center = {
            lat: 45.763077261919285,
            lng: 4.832567539683908
        };

        this.http.get("assets/rate_result.json").subscribe(file => {
            Object.keys(file).forEach((index: any) => {
                // @ts-ignore
                let restaurant: Restaurant = file[index] as Restaurant;

                const splitResult : string = restaurant.url.split("@")[1];
                const pos : string[] = splitResult.split(",");

                var googleMarker: MarkerProperties = {
                    position: {
                        lat: parseFloat(pos[0]),
                        lng: parseFloat(pos[1]),
                    },
                    label: restaurant.name,
                    organicRate:  Math.round(restaurant.rate.rate_organic),
                    climateRate: Math.round(restaurant.rate.rate_climate),
                    waterSavyRate: Math.round(restaurant.rate.rate_water_savy),
                    socialRate: Math.round(restaurant.rate.rate_social),
                    governanceRate: Math.round(restaurant.rate.rate_governance),
                    wasteRate: Math.round(restaurant.rate.rate_waste),
                    adverseRate: Math.round(restaurant.rate.rate_adverse),
                    index: index
                };
                this.markers.push(googleMarker);
            });

            this.handleMapInitialized(this.gmap!);
        });
    }

    handleMapInitialized(map: google.maps.Map) {
        this.gmap = map;

        this.markers.forEach((marker: MarkerProperties) => {
            const googleMarker = new google.maps.Marker({
                position: marker.position,
                map,
                label: { text: marker.label, color: 'black' },
            });
            googleMarker.addListener('click', () => this.onMarkerClick(marker));
            this.addedMarkers.push(googleMarker);
        });

    }

    markerFilters(){
        this.addedMarkers.forEach((marker, index) => {
            const name = this.filter === "" || (marker.getLabel() as google.maps.MarkerLabel).text.toLowerCase().includes(this.filter.toLowerCase());
            const organic = !this.isOrganic || this.markers[index].organicRate > 3;
            const climate = !this.isClimate || this.markers[index].climateRate > 3;
            const waterSavy = !this.isWaterSavy || this.markers[index].waterSavyRate > 3;
            const social = !this.isSocial || this.markers[index].socialRate > 3;
            const governance = !this.isGovernance || this.markers[index].governanceRate > 3;
            const waste = !this.isWaste || this.markers[index].wasteRate > 3;
            const adverse = !this.isAdverse || this.markers[index].adverseRate > 3;

            marker.setVisible(name && organic && climate && waterSavy && social && governance && waste && adverse);
        });
    }

    onMarkerClick(clickedMarker: MarkerProperties) {
        this.markerClicked = true;
        this.selected = clickedMarker;
    }
}

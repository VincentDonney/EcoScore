import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {GoogleMap, GoogleMapsModule} from "@angular/google-maps";

interface MarkerProperties {
    position: {
        lat: number;
        lng: number;
    }
    label: string;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GoogleMapsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    @ViewChild('myGoogleMap', { static: true }) map!: GoogleMap;

    JSONDATA: string = '[\n' +
        '    {\n' +
        '        "name": "BrasserieGeorges",\n' +
        '        "url": "https://www.google.com/maps/place/Brasserie+Georges/@45.7482668,4.8122838,15z/data=!4m10!1m2!2m1!1srestaurants+lyon!3m6!1s0x47f4ea4b3d8af4f7:0x9fd71c9b0d71f8b2!8m2!3d45.7482668!4d4.8283066!15sChByZXN0YXVyYW50cyBseW9uWhIiEHJlc3RhdXJhbnRzIGx5b26SARRyZXN0YXVyYW50X2JyYXNzZXJpZeABAA!16s%2Fm%2F09k6fg7?entry=ttu",\n' +
        '        "rate": {\n' +
        '            "organic": 0,\n' +
        '            "climate": 1,\n' +
        '            "water_savy": 2,\n' +
        '            "social": 3,\n' +
        '            "governance": 4,\n' +
        '            "waste": 5,\n' +
        '            "adverse": 0\n' +
        '        }\n' +
        '    }\n' +
        ']'


    regex = /([+-]?(?=\.\d|\d)(?:\d+)?\.?\d*)(?:[Ee]([+-]?\d+))?,([+-]?(?=\.\d|\d)(?:\d+)?\.?\d*)(?:[Ee]([+-]?\d+))?/g;

    mapOptions: google.maps.MapOptions = {
        center: { lat: 48.8588548, lng: 2.347035 },
        zoom: 13,
    };

    zoom = 12;
    center: google.maps.LatLngLiteral = {lat: 0, lng: 0};
    options: google.maps.MapOptions = {
        scrollwheel: true,
        disableDoubleClickZoom: true,
        mapTypeId: 'roadmap',
        maxZoom: 15,
        minZoom: 0,
    };
    markers: MarkerProperties[] = [];

    ngOnInit() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
        });

        JSON.parse(this.JSONDATA).forEach((element: any) => {
            let match = this.regex.exec(element.url);
            if(match) {
                this.markers.push({
                    position: {
                        lat: parseFloat(match[1]),
                        lng: parseFloat(match[3]),
                    },
                    label: element.name,
                })
            }
        });
    }

    handleMapInitialized(map: google.maps.Map) {
        this.markers.forEach((marker: MarkerProperties) => {
            new google.maps.Marker({
                position: marker.position,
                map,
                label: {text : marker.label, color: 'blue'},
            })
        });
    }


    zoomIn() {
        if(!this.options.maxZoom)
            return
        if (this.zoom < this.options.maxZoom) this.zoom++;
    }

    zoomOut() {
        if(!this.options.minZoom)
            return
        if (this.zoom > this.options.minZoom) this.zoom--;
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GoogleMap, GoogleMapsModule } from "@angular/google-maps";
import { FormsModule } from '@angular/forms';
import reviewsData from "../../../reviews.json";

interface MarkerProperties {
  position: {
    lat: number;
    lng: number;
  }
  label: string;
  organicRate: number;
  climateRate: number; 
  waterSavyRate: number; 
  socialRate: number; 
  governanceRate: number; 
  wasteRate: number; 
  adverseRate: number; 
  index: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GoogleMapsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('myGoogleMap', { static: true }) map!: GoogleMap;

  @ViewChild('isOrganic') isOrganic: boolean = false;
  @ViewChild('isClimate') isClimate: boolean = false;
  @ViewChild('isWaterSavy') isWaterSavy: boolean = false;
  @ViewChild('isSocial') isSocial: boolean = false;
  @ViewChild('isWaste') isWaste: boolean = false;
  @ViewChild('isGovernance') isGovernance: boolean = false;
  @ViewChild('isAdverse') isAdverse: boolean = false;
  
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
  selectedNbReviews: number = 0;

  gmap? : google.maps.Map;

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
    ']';

  regex = /([+-]?(?=\.\d|\d)(?:\d+)?\.?\d*)(?:[Ee]([+-]?\d+))?,([+-]?(?=\.\d|\d)(?:\d+)?\.?\d*)(?:[Ee]([+-]?\d+))?/g;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 48.8588548, lng: 2.347035 },
    zoom: 13,
  };

  zoom = 12;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  options: google.maps.MapOptions = {
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'roadmap',
    maxZoom: 15,
    minZoom: 0,
  };
  markers: MarkerProperties[] = [];
  addedMarkers: google.maps.Marker[] = [];
  filter: string = "";

  ngOnInit() {
    this.center = {
      lat: 45.750000,
      lng: 4.850000
    }

    //Object.keys(reviewsData).forEach((key: string) => {
      //const element = reviewsData[key];
    JSON.parse(this.JSONDATA).forEach((element: any, index: number) => {
      let match = this.regex.exec(element.url);
      if (match) {
        var googleMarker: MarkerProperties = {
         position: {
            lat: parseFloat(match[1]),
            lng: parseFloat(match[3]),
          },
          label: element.name,
          organicRate: element.rate.organic,
          climateRate: element.rate.climate,
          waterSavyRate: element.rate.water_savy,
          socialRate: element.rate.social,
          governanceRate: element.rate.governance,
          wasteRate: element.rate.waste,
          adverseRate: element.rate.adverse,
          index: index
        };
        this.markers.push(googleMarker);

        this.addedMarkers.push(new google.maps.Marker({
            position: googleMarker.position,
            map: this.gmap,
            label: { text: googleMarker.label, color: 'blue' },
          }));
      }
    });
    
  }

  handleMapInitialized(map: google.maps.Map) {
    this.gmap = map;
     
    this.markers.forEach((marker: MarkerProperties) => {
      var googleMarker = new google.maps.Marker({
        position: marker.position,
        map,
        label: { text: marker.label, color: 'blue' },
      });
      googleMarker.addListener('click', () => this.onMarkerClick(marker));
    });

  }

  zoomIn() {
    if (!this.options.maxZoom)
      return
    if (this.zoom < this.options.maxZoom) this.zoom++;
  }

  zoomOut() {
    if (!this.options.minZoom)
      return
    if (this.zoom > this.options.minZoom) this.zoom--;
  }

  markerFilters(){

    this.markers.forEach((marker) => {
        /*
        if (this.filter !="" && !marker.label.includes(this.filter)){
            this.addedMarkers[marker.index].setVisible(false);
        } else if (this.isClimate && marker.climateRate <= 3) {
            this.addedMarkers[marker.index].setVisible(false);
        } else if (this.isWaterSavy && marker.waterSavyRate <= 3) {
            this.addedMarkers[marker.index].setVisible(false);
        } else if (this.isSocial && marker.socialRate <= 3) {
            this.addedMarkers[marker.index].setVisible(false);
        } else if (this.isGovernance && marker.governanceRate <= 3) {
            this.addedMarkers[marker.index].setVisible(false);
        } else if (this.isWaste && marker.wasteRate <= 3) {
            this.addedMarkers[marker.index].setVisible(false);
        } else if (this.isAdverse && marker.adverseRate <= 3) {
            this.addedMarkers[marker.index].setVisible(false);
        } else {
            this.addedMarkers[marker.index].setVisible(true);
        }
        */
        if (this.gmap != undefined)
            this.addedMarkers[0].setLabel("aaaaaaa");
    });
    
  }



  onMarkerClick(clickedMarker: MarkerProperties) {
    this.markerClicked = true;
    this.selected = clickedMarker;
    // You can perform additional actions when a marker is clicked
}


}

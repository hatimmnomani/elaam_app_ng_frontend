import { Component, OnInit, Input } from "@angular/core";

import * as L from "leaflet";
import "leaflet.markercluster";

@Component({
  selector: "map",
  templateUrl: "./map.component.html",
})
export class MapComponent implements OnInit {
  @Input() coords: any;
  options = {
    zoom: 5,
    maxZoom: 18,
    center: L.latLng([23.0225, 72.5714]),

    layers: [
      //    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {})
      L.tileLayer(
        "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          noWrap: true,
        }
      ),
    ],
  };

  // Marker cluster stuff

  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: L.Marker[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;

  ngOnInit() {
    this.markerClusterData = this.generateMarker(this.coords);
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  generateMarker(coords: any): L.Marker[] {
    const data: L.Marker[] = [];
    const icon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      popupAnchor: [20, 10], // point from which the popup should open relative to the iconAnchor
      // specify the path here
      iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png",
    });

    coords.forEach((cord: any) => {
      if (cord.latitude && cord.longitude) {
        let marker1 = L.marker(
          [
            cord.latitude === 0 ? 23.0225 : cord.latitude,
            cord.longitude === 0 ? 72.5714 : cord.longitude,
          ],
          { icon }
        );
        marker1.bindPopup(
          `Name: ${cord.name} <br> Active: ${cord.statusCountDto.active} <br> Approval Pending: ${cord.statusCountDto.approvalPending} <br> Completed: ${cord.statusCountDto.completed} <br> Total Niyat: ${cord.statusCountDto.totalNiyat} <br> Deactivated: ${cord.statusCountDto.deactivated ? cord.statusCountDto.deactivated:'0'}`
        ).on('popupopen', function () {
          const closeButtons = document.getElementsByClassName('leaflet-popup-close-button');
          L.DomEvent.on(closeButtons[0] as HTMLElement, 'click', function(ev){ 
          ev.preventDefault(); // 3. stop it here
          });
          });
        data.push(marker1);
      }
    });

    return data;
  }
}
